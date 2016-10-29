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
seneca.add({role: 'location', resource:'locations', cmd: 'GET'}, (args, callback) => {

  act({role: 'stores', cmd: 'find'})
    .then(result => {
      // Perform some aggregation / transformation on the results
      var locationResult = {
        timestamp: new Date(),
        stores: result
      };

      callback(null, locationResult);
    })
    .catch(callback);
});

seneca.add({role: 'location', resource:'locations', cmd: 'POST'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log(err);
    });
});

// =============== location/:locationId ===============
seneca.add({role: 'location', resource:'location', cmd: 'GET'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log(err);
    });
});

seneca.add({role: 'location', resource:'location', cmd: 'PUT'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log(err);
    });
});

seneca.add({role: 'location', resource:'location', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(res => {
      return {data: res};
    })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      console.log(err);
    });
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
