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

seneca.add({role: 'location', cmd: 'list'}, (args, callback) => {

  act({role: 'stores', cmd: 'list'})
    .then(function (result) {
      // Perform some aggregation / transformation on the results
      var locationResult = {
        timestamp: new Date(),
        stores: result
      };

      callback(null, locationResult);
    })
    .catch(callback);
});

seneca.add({role: 'location', cmd: 'status'}, (args, callback) => {

  act({role: 'find', cmd: 'status'})
    .then(function (res) {
      return {data: res};
    })
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      console.log(err);
    });
});

seneca.add({role: 'location', cmd: 'learn'}, (args, callback) => {

  act({role: 'find', cmd: 'learn', ap:args.ap})
    .then(function (res) {
      return {data: res};
    })
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      console.log(err);
    });
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
