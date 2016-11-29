'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  setupStubs(seneca);

} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.find_service_PORT,
    pin: {role: 'find'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.stores_PORT,
    pin: {role: 'stores'}
  });
}

function beaconToFingerprint(beacons){
  const fingerprints = [];
  console.log(beacons);
  console.log(decodeURI(beacons));

  decodeURI(beacons).split(',')
  .forEach(tuple => {
    const fp = tuple.split('=');
    if (fp.length != 2){
      console.log("Invalid beacon reference found: ", tuple);
    } else {
      fingerprints.push({
        mac: fp[0],
        rssi: Number(fp[1])
      });
    }
  });

  console.log(fingerprints);
  return fingerprints;
}

// =============== /locate ===============
// =============== ?username=someusername ===============
// =============== ?group=someGroup ===============
// =============== ?beacons=24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16%2C32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
seneca.add({role: 'location', resource:'locate', cmd: 'GET'}, (args, callback) => {

  if (args.beacons == null){
    callback({error: 'Missing beacons'})
  }

  if (args.username == null || args.group == null){
    callback({error: 'Missing username and group'})
  }

  const trackingInformation = {
    group: args.group,
    username: args.username,
    time: Date.now().toString()
  };

  trackingInformation["wifi-fingerprint"] = beaconToFingerprint(args.beacons);

  const params = {
    trackingInfo: trackingInformation
  }

  console.log(trackingInformation);

  act({role: 'find', cmd: 'locate'}, params)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

// =============== /locations ===============
seneca.add({role: 'location', resource:'locations', cmd: 'GET'}, (args, callback) => {

  const params = {
    group: 'Stores'
  }

  act({role: 'find', cmd: 'list'}, params)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);

});


seneca.add({role: 'location', resource:'locations', cmd: 'PUT'}, (args, callback) => {

  if (args.body == null){
    callback("Missing tracking information data in body")
  }

  const params = {
    trackingInfo: args.body
  }
  console.log(params);
  act({role: 'find', cmd: 'learn'}, params)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

// =============== /locations/:locationId ===============
seneca.add({role: 'location', resource:'location', cmd: 'DELETE'}, (args, callback) => {

  if (!args.locationId){
    callback("Missing location name")
  }

  const params = {
    group: 'Stores',
    location: args.locationId
  }

  act({role: 'find', cmd: 'delete', type: 'location'}, params)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});


// =============== /discover ===============

// =============== ?geo=-34.6375814,-58.4344577,15z,1000 ===============
// =============== ?username=name&beacons=24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16%2C32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
// =============== ?locations=baoou3223g4,baiubkh231g4 ===============
seneca.add({role: 'location', resource:'discover', cmd: 'GET'}, (args, callback) => {

  //TODO if necessary

  // if (args.locations){
  //   const params = {
  //     where: {
  //       locations: { $in: args.locations.split(',') }
  //     }
  //   }
  //
  //   act({role: 'stores', cmd: 'read'}, params)
  //     .then(result => {
  //       callback(null, result);
  //     })
  //     .catch(callback);
  // }

  //FIXME copy paste
  const username = args.username ? args.username : 'admin';
  const trackingInformation = {
    group: 'Stores',
    username: username,
    time: Date.now().toString(),
  };

  trackingInformation["wifi-fingerprint"] = beaconToFingerprint(args.beacons);

  const params = {
    trackingInfo: trackingInformation
  }

  act({role: 'find', cmd: 'locate'}, params)
    .then(result => {
      const locations = Object.keys(result.bayes);
      console.log(locations);

      const params = {
        where: {
          locations: { $in: locations }
        }
      }

      console.log(params);
      act({role: 'stores', cmd: 'read'}, params)
        .then(result => {
          console.log(result);
          callback(null, result);
        })
        .catch(callback);
    })
    .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});


function setupStubs(seneca){
  seneca.stub('role:find', (args, cb) => {
    cb(null, args)
  });
  seneca.stub('role:find,cmd:locate', (args, cb) => {
    const bayesResult = {};
    args.trackingInfo[wififingerprint].forEach(fp => {
      bayesResult[`${args.trackingInfo.username}:${fp.mac}`] = fp.rssi;
    });

    cb(null, {
      'success': true,
      'message': `Calculated for ${args.trackingInfo.username}`,
      'location': 'main location name',
      'bayes': bayesResult
    })
  });

  seneca.stub('role:stores', (args, cb) => {
    cb(null, args)
  });
}


module.exports.seneca = seneca;
