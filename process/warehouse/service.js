'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  seneca.stub('role:products', (args, cb) => {
    cb(null, args)
  });
} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'products'}
  });
}


// =============== products ===============

seneca.add({role: 'warehouse', resource:'products', cmd: 'POST'}, (args, callback) => {

  if (!args.body){
    callback("Missing product data in body")
  }

  const params = {
    product: args.body
  }
  act({role: 'products', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);

});


// =============== ?tags=tag01,tag02 ===============
seneca.add({role: 'warehouse', resource:'products', cmd: 'GET'}, (args, callback) => {

  const params = {};
  if (args.tags){
    params.where = {tags: {"$all": args.tags.split(",")}};
  }

  act({role: 'products', cmd: 'read'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});


// =============== products/:productId ===============
seneca.add({role: 'warehouse', resource:'product', cmd: 'GET'}, (args, callback) => {

  if (!args.productId){
    callback("Missing product data in body")
  }

  const params = {
    id: args.productId
  }

  act({role: 'products',  cmd: 'read', type: 'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', resource:'product', cmd: 'PUT'}, (args, callback) => {

  if (!args.body){
    callback("Missing product data in body")
  }

  if (!args.productId){
    callback("Missing product data in body")
  }

  const params = {
    id: args.productId,
    doc: args.body
  }
  act({role: 'products', cmd: 'update', type: 'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'warehouse', resource:'product', cmd: 'DELETE'}, (args, callback) => {

  if (!args.productId){
    callback("Missing product data in body")
  }

  const params = {
    id: args.productId
  }
  act({role: 'products', cmd: 'delete', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
