'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_PORT,
  pin: {role: 'stores'}
});

seneca.add({role: 'stores-management', cmd: 'create'}, (args, callback) => {

  act({role: 'stores', cmd: 'create'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', cmd: 'list'}, (args, callback) => {
  act({role: 'stores', cmd: 'find'})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', cmd: 'delete'}, (args, callback) => {

  const msg = {role: 'stores', cmd: 'remove'};
  if (args.params.id) {
    msg.type = 'id';
    msg.id = args.id;

  } else if (args.body) {
    msg.type = 'one';
    msg.where = args.body;
  } else {
    callback("ERROR MISSING conditions, use either ID or a condition as payload")
  }

  if (args.params.ops) {
    msg.ops = args.params.ops;
  }

  act(msg)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', cmd: 'update'}, (args, callback) => {
  const msg = {role: 'stores', cmd: 'update', type: 'one', ops: {}};

  if (args.params.id) {
    Object.assign(msg, {type: 'id', id: args.params.id, doc: args.body});

  } else {
    Object.assign(msg, {where: args.body.where, doc: args.body.put});

    if (args.params.multi){
      Object.assign(msg, {type: 'bulk', ops:{multi: true}});
    }
  }

  console.log(msg);

  if (!(msg.id || msg.where)) {
    return callback("ERROR MISSING ID OR CONDITION");
  }

  if (!msg.new) {
    return callback("ERROR MISSING NEW DOC");
  }

  if (args.params.ops) {
    msg.ops = args.params.ops;
  }


  act(msg)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', cmd: 'info'}, (args, callback) => {
  act({role: 'stores', cmd: 'find', type: 'id'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
