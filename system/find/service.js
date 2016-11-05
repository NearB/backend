'use strict';

var Find = require('./models/Find.js');
var seneca = require('seneca')();

var client;

if (process.env.TESTING){
  var sinon = require('sinon-es6');
  client = setupStubs(sinon);
} else {
  client = new Find();
}



const successCb = (cb) => {
  return res => {
    return cb.call(this, null, res);
  }
};

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

seneca.add({role: 'find', cmd: 'status'}, (args, callback) => {

  client.status()
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});

seneca.add({role: 'find', cmd: 'list'}, (args, callback) => {

  if (!args.group){
    callback({error: 'Missing group name'})
  }

  client.listLocations(args.group)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});

seneca.add({role: 'find', cmd: 'learn'}, (args, callback) => {

  if (!args.trackingInfo){
    callback({error: 'Missing group name'})
  }
  //TODO validate even further

  client.learn(args.trackingInfo)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});

seneca.add({role: 'find', cmd: 'locate'}, (args, callback) => {

  if (!args.trackingInfo){
    callback({error: 'Missing group name'})
  }
  //TODO validate even further

  client.track(args.trackingInfo)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});

seneca.add({role: 'find', cmd: 'delete', type: 'location'}, (args, callback) => {

  if (!args.group){
    callback({error: 'Missing group name'})
  }

  if (!args.location){
    callback({error: 'Missing location name'})
  }

  client.deleteLocation(args.group, args.location)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});

seneca.add({role: 'find', cmd: 'delete', type: 'user'}, (args, callback) => {

  if (!args.group){
    callback({error: 'Missing group name'})
  }

  if (!args.username){
    callback({error: 'Missing username'})
  }

  client.deleteUser(args.group, args.username)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
});


// Stubs fot testing only
function setupStubs(sinon){
  client = sinon.createStubInstance(Find);
  sinon.stub(client, 'status', () => {
    return new Promise((resolve, reject) => {
      resolve({
        'num_cores': 4,
        'registered': '2016-11-05 20:22:06.381030632 +0000 UTC',
        'status': 'standard',
        'uptime': 5248.878205831
      });
    });
  });

  sinon.stub(client, 'learn', (trackingInfo) => {
    return new Promise((resolve, reject) => {
      if (trackingInfo){
        resolve({
          'success': true,
          'message': `Inserted fingerprint containing ${trackingInfo['wifi-fingerprint']} APs for ${trackingInfo.username}`
        });
      } else {
        reject('Invalid trackingInfo');
      }
    });
  });

  sinon.stub(client, 'track', (trackingInfo) => {
    return new Promise((resolve, reject) => {
      if (trackingInfo){
        resolve({
          'success': true,
          'message': `Calculated for ${trackingInfo.username}`,
          'location': trackingInfo.location,
          'bayes': {
              'zakhome floor 1 kitchen': 0.07353831034486494,
              'zakhome floor 2 bedroom': -0.9283974092154644,
              'zakhome floor 2 office': 0.8548590988705993
            }
        });
      } else {
        reject('Invalid trackingInfo');
      }
    });
  });

  sinon.stub(client, 'listLocations', (groupName) => {
    return new Promise((resolve, reject) => {
      if (groupName){
        resolve({
          'message': groupName,
          'success': true,
          'users': {
            'alem': [
              {
                'time': '2016-11-05 20:41:47.625580522 +0000 UTC',
                'location': 'loctwo',
                'bayes': {
                  'locone': -0.7071067811865499,
                  'loctwo': 0.7071067811865451
                },
                'svm': null
              }
            ]
          }
        });
      } else {
        reject('Invalid groupName');
      }
    });
  });

  sinon.stub(client, 'deleteLocation', (groupName, locationName) => {
    return new Promise((resolve, reject) => {
      if (groupName && locationName){
        resolve({
          'success':true,
          'message': `Deleted ${locationName} from ${groupName}`
        });
      } else {
        reject('Invalid groupName or username');
      }
    });
  });

  sinon.stub(client, 'deleteUser', (groupName, username) => {
    return new Promise((resolve, reject) => {
      if (groupName && username){
        resolve({
          'success':true,
          'message': `Deleted ${username} from ${groupName}`
        });
      } else {
        reject('Invalid groupName or username');
      }
    });
  });
  return client;
}

module.exports.seneca = seneca;
