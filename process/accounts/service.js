'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.users_PORT,
  pin: {role: 'users'}
});

// =============== /users ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  act({role: 'users', cmd: 'read'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'users', cmd: 'POST'}, (args, callback) => {

  act({role: 'users', cmd: 'create'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /users/:userId ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  act({role: 'users', cmd: 'read', type: 'one'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'PUT'}, (args, callback) => {

  act({role: 'users', cmd: 'update', type: 'id'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'users', cmd: 'delete', type: 'id'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /users/:userId/alerts ===============
seneca.add({role: 'accounts', resource:'alerts', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'alerts', cmd: 'POST'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /users/:userId/stores ===============
seneca.add({role: 'accounts', resource:'stores', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
