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

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_PORT,
  pin: {role: 'stores'}
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.users_PORT,
  pin: {role: 'users'}
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.campaigns_PORT,
  pin: {role: 'campaigns'}
});

seneca.add({role: 'engagement', resource:'carts', cmd: 'POST'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'cart', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'cart', cmd: 'PUT'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'cart', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'product', cmd: 'PUT'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'product', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'engagement', resource:'promotions', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
