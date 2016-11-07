'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  seneca.stub('role:users', (args, cb) => {
    cb(null, args)
  });
} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.users_PORT,
    pin: {role: 'users'}
  });

}

// =============== /users ===============
seneca.add({role: 'accounts', resource:'users', cmd: 'GET', type: 'username'}, (args, callback) => {

  if (!args.username){
    callback("Missing username");
  }

  const params = {
    where: {username: args.username}
  };

  act({role: 'users', cmd: 'read', type: 'one'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});


seneca.add({role: 'accounts', resource:'users', cmd: 'GET', type: 'fbLogin'}, (args, callback) => {

  if (!args.fbId){
    callback("Missing fb Id");
  }

  const params = {
    where: {fbId: args.fbId}
  };

  act({role: 'users', cmd: 'read', type: 'one'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== ?preferences=tag02,tag02 ===============
seneca.add({role: 'accounts', resource:'users', cmd: 'GET'}, (args, callback) => {

  const params = {};
  if (args.preferences){
    params.where = {filters: {"$all": args.preferences.split(",")}};
  }

  act({role: 'users', cmd: 'read'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'users', cmd: 'POST'}, (args, callback) => {

  if (!args.body){
    callback("Missing user data in body")
  }

  const params = {
    user: args.body
  }

  act({role: 'users', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /users/:userId ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  if (!args.userId){
    callback("Missing userId id in url")
  }

  const params = {
    id: args.userId
  }

  act({role: 'users', cmd: 'read', type: 'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'PUT'}, (args, callback) => {

  if (!args.body){
    callback("Missing user data in body")
  }

  if (!args.userId){
    callback("Missing userId")
  }

  const params = {
    id: args.userId,
    doc: args.body
  }

  act({role: 'users', cmd: 'update', type: 'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'accounts', resource:'user', cmd: 'DELETE'}, (args, callback) => {

  if (!args.userId){
    callback("Missing userId")
  }

  const params = {
    id: args.userId
  }

  act({role: 'users', cmd: 'delete', type: 'id'}, params)
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
