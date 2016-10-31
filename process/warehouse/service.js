'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.products_PORT,
  pin: {role: 'products'}
});

// =============== products ===============

// =============== ?tags=tag01,tag02 ===============
seneca.add({role: 'warehouse', resource:'products', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', resource:'products', cmd: 'POST'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== products/:productId ===============
seneca.add({role: 'warehouse', resource:'product', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', resource:'product', cmd: 'PUT'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', resource:'product', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
