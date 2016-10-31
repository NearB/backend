'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

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


// =============== /locations ===============

// =============== ?beacons=24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16,32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
seneca.add({role: 'location', resource:'locations', cmd: 'GET'}, (args, callback) => {

  act({role: '', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);

  // act({role: 'stores', cmd: 'find'})
  //   .then(result => {
  //     // Perform some aggregation / transformation on the results
  //     var locationResult = {
  //       timestamp: new Date(),
  //       stores: result
  //     };
  //
  //     callback(null, locationResult);
  //   })
  //   .catch(callback);
});

seneca.add({role: 'location', resource:'locations', cmd: 'PUT'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

//removes the locations that match the given Fingerprint filter
seneca.add({role: 'location', resource:'locations', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

// =============== /location/:locationId ===============
seneca.add({role: 'location', resource:'location', cmd: 'GET'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

seneca.add({role: 'location', resource:'location', cmd: 'PUT'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

seneca.add({role: 'location', resource:'location', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});

// =============== /discover ===============

// =============== ?geo=-34.6375814,-58.4344577,15z,1000 ===============
// =============== ?beacons=24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16&32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
// =============== ?locations=baoou3223g4,baiubkh231g4 ===============
seneca.add({role: 'location', resource:'discover', cmd: 'GET'}, (args, callback) => {

  act({role: 'cartProduct', cmd: 'delete', type:'id'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
