'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  seneca.stub('role:stores', (args, cb) => {
    cb(null, args)
  });
} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.stores_PORT,
    pin: {role: 'stores'}
  });

}

// =============== stores ===============
seneca.add({role: 'stores-management', resource:'stores', cmd: 'GET'}, (args, callback) => {

  act({role: 'stores', cmd: 'read'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'stores', cmd: 'POST'}, (args, callback) => {

  if (!args.body){
    callback({error: "Missing store data in body"})
  }

  const params = {
    store: args.body
  }

  act({role: 'stores', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== stores/:storeId ===============
seneca.add({role: 'stores-management', resource:'store', cmd: 'GET'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"})
  }

  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'store', cmd: 'PUT'}, (args, callback) => {

  if (!args.body){
    callback({error: "Missing store data in body"})
  }

  if (!args.storeId){
    callback({error: "Missing storeId"})
  }

  const params = {
    id: args.storeId,
    doc: args.body
  }

  act({role: 'stores', cmd: 'update', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'store', cmd: 'DELETE'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId"})
  }

  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'delete', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== stores/:storeId/products ===============
seneca.add({role: 'stores-management', resource:'products', cmd: 'GET'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"})
  }

  //FIXME select: 'stock'   REMOVE .select('-__v')
  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        //FIXME select: 'stock'   REMOVE .select('-__v')
        callback(null, result.stock);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'products', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"});
  }

  if (!args.body){
    callback({error: "Missing store data in body"});
  }

  const params = {
    id: args.storeId
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        var newStock = [args.body];
        if (result.stock){
          newStock = result.stock.concat(newStock)
        }
        const updatedStore = Object.assign({}, result, {stock: newStock})

        const updateParams = {
          id: args.storeId,
          doc: updatedStore
        }

        act({role: 'stores', cmd: 'update', type:'id'}, updateParams)
            .then(result => {
              callback(null, result);
            })
            .catch(callback);
      })
      .catch(callback);
});


// =============== stores/:storeId/campaigns ===============
seneca.add({role: 'stores-management', resource:'campaigns', cmd: 'GET'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"})
  }

  //FIXME select: 'stock'   REMOVE .select('-__v')
  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        //FIXME select: 'stock'   REMOVE .select('-__v')
        callback(null, result.campaignTags);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'campaigns', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"});
  }

  if (!args.body){
    callback({error: "Missing store data in body"});
  }

  const params = {
    id: args.storeId
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        var newCampaignTags = [args.body];
        if (result.campaignTags){
          newCampaignTags = result.campaignTags.concat(newCampaignTags)
        }
        const updatedStore = Object.assign({}, result, {campaignTags: newCampaignTags})

        const updateParams = {
          id: args.storeId,
          doc: updatedStore
        }

        act({role: 'stores', cmd: 'update', type:'id'}, updateParams)
            .then(result => {
              callback(null, result);
            })
            .catch(callback);
      })
      .catch(callback);
});

// =============== stores/:storeId/ads ===============
seneca.add({role: 'stores-management', resource:'ads', cmd: 'GET'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"})
  }

  //FIXME select: 'stock'   REMOVE .select('-__v')
  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        //FIXME select: 'stock'   REMOVE .select('-__v')
        callback(null, result.adTags);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'ads', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback({error: "Missing storeId id in url"});
  }

  if (!args.body){
    callback({error: "Missing store data in body"});
  }

  const params = {
    id: args.storeId
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        var newAdTags = [args.body];
        if (result.adTags){
          newAdTags = result.adTags.concat(newAdTags)
        }
        const updatedStore = Object.assign({}, result, {adTags: newAdTags})

        const updateParams = {
          id: args.storeId,
          doc: updatedStore
        }

        act({role: 'stores', cmd: 'update', type:'id'}, updateParams)
            .then(result => {
              callback(null, result);
            })
            .catch(callback);
      })
      .catch(callback);
});

// // =============== stores/:storeId/clients ===============
// seneca.add({role: 'stores-management', resource:'clients', cmd: 'GET'}, (args, callback) => {
//
//   act({role: 'stores', cmd: 'create'}, params)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });
// seneca.add({role: 'stores-management', cmd: 'create'}, (args, callback) => {
//
//   act({role: 'stores', cmd: 'create'}, params)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });
//
// seneca.add({role: 'stores-management', cmd: 'list'}, (args, callback) => {
//   act({role: 'stores', cmd: 'find'})
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });
//
// seneca.add({role: 'stores-management', cmd: 'delete'}, (args, callback) => {
//
//   const msg = {role: 'stores', cmd: 'remove'};
//   if (args.params.id) {
//     msg.type = 'id';
//     msg.id = args.id;
//
//   } else if (args.body) {
//     msg.type = 'one';
//     msg.where = args.body;
//   } else {
//     callback("ERROR MISSING conditions, use either ID or a condition as payload")
//   }
//
//   if (args.params.ops) {
//     msg.ops = args.params.ops;
//   }
//
//   act(msg)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });
//
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
//       Object.assign(msg, {type: 'bulk', ops:{multi: true}});
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
//   act({role: 'stores', cmd: 'find', type: 'id'}, params)
//       .then(result => {
//         callback(null, result);
//       })
//       .catch(callback);
// });

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
