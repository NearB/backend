'use strict';

const _s = require("underscore.string");
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

// =============== /login ===============
seneca.add({role: 'accounts', resource:'login', cmd: 'POST'}, (args, callback) => {

  if (args.body == null){
    callback("Missing user profile data in body");
  }

  const profile = args.body;
  const params = {
      user: {
        authId: profile.user_id != null ? profile.user_id : profile.userId,
        username: _s.camelize(_s.trim(profile.name), true),
        name: profile.name,
        profile: profile
      }
  };

  act({role: 'users', cmd: 'read', type: 'one'},
      {
        where: {auth: profile.user_id}
      })
      .then(result => {
        if (result == null){
          act({role: 'users', cmd: 'create'}, params)
              .then(result => {
                callback(null, result);
              })
              .catch(callback);
        } else {
          callback(null, result);
        }
      })
      .catch(callback);
});

// =============== ?auth=authId ===============
seneca.add({role: 'accounts', resource:'login', cmd: 'GET'}, (args, callback) => {

  if (args.authId == null){
    callback("Missing authId");
  }

  const params = {
    where: {auth: decodeURI(args.auth_id)}
  };

  act({role: 'users', cmd: 'read', type: 'one'}, params)
      .then(result => {
        if (result == null){
          callback("User not found");
        } else {
          callback(null, result);
        }
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

// =============== /users/:userId ===============
seneca.add({role: 'accounts', resource:'user', cmd: 'GET'}, (args, callback) => {

  if (args.userId  == null){
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

  if (args.body == null){
    callback("Missing user data in body")
  }

  if (args.userId == null){
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

  if (args.userId == null){
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
