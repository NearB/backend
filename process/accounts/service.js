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

// =============== ?preferences=tag02,tag02 ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  const filters = args.preferences;
  console.log("filters: ", filters);

  act({role: 'users', cmd: 'read'})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'users', cmd: 'POST'}, (args, callback) => {

  const user = args.body;
  console.log("user: ", filters);

  act({role: 'users', cmd: 'create'}, {user: user})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /users/:userId ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  act({role: 'users', cmd: 'read', type: 'id'}, {id: args.userId})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'PUT'}, (args, callback) => {

  act({role: 'users', cmd: 'update', type: 'id'},
        {
          id: args.userId,
          doc: args.body
        }
      ).then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'users', cmd: 'delete', type: 'id'}, {id: args.userId})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// // =============== /users/:userId/alerts ===============
// seneca.add({role: 'accounts', resource:'alerts', cmd: 'GET'}, (args, callback) => {
//   //REVIEW if actually supported
// });
//
// seneca.add({role: 'accounts', resource:'alerts', cmd: 'POST'}, (args, callback) => {
//   //REVIEW if actually supported
// });

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
