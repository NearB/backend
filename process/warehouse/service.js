'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.content_PORT,
  pin: {role: 'content'}
});

seneca.add({role: 'warehouse', cmd: 'add'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', cmd: 'stock'}, (args, callback) => {
  act({role: 'content', cmd: 'find'})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', cmd: 'stock', type: 'store'}, (args, callback) => {
  act({
    role: 'content', cmd: 'find', type: 'store',
    store: args.store, select: '-_owner -_store'
  })
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', cmd: 'delete'}, (args, callback) => {

  const msg = {role: 'content', cmd: 'remove', type: 'item', id: args.id};
  if (args.params.ops) {
    msg.ops = args.params.ops;
  }

  act(msg)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// seneca.add({role: 'stores-management', cmd: 'update'}, (args, callback) => {
//   const msg = {role: 'stores', cmd: 'update', type: 'one', ops: {}};
//
//   if (args.params.id) {
//     Object.assign(msg, {type: 'id', id: args.params.id, doc: args.body});
//
//   } else {
//     Object.assign(msg, {where: args.body.where, doc: args.body.put});
//
//     if (args.params.multi){
//       Object.assign(msg, {type: 'multi', ops:{multi: true}});
//     }
//   }
//
//   console.log(msg);
//
//   if (!(msg.id || msg.where)) {
//     return callback("ERROR MISSING ID OR CONDITION");
//   }
//
//   if (!msg.new) {
//     return callback("ERROR MISSING NEW DOC");
//   }
//
//   if (args.params.ops) {
//     msg.ops = args.params.ops;
//   }
//
//
//   act(msg)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });
//
// seneca.add({role: 'stores-management', cmd: 'info'}, (args, callback) => {
//   act({role: 'stores', cmd: 'find', type: 'id'}, args)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
