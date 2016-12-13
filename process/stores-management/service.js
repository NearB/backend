'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();
const _ = require('lodash');

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  setupStubs(seneca);
} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.stores_PORT,
    pin: {role: 'stores'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'products'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.campaigns_PORT,
    pin: {role: 'campaigns'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.campaigns_PORT,
    pin: {role: 'ads'}
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
    callback("Missing store data in body")
  }

  const params = {
    store: args.body
  };

  act({role: 'stores', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== stores/:storeId ===============
seneca.add({role: 'stores-management', resource:'store', cmd: 'GET'}, (args, callback) => {

  if (!args.storeId){
    callback("Missing storeId id in url")
  }

  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(store => {
        callback(null, store);
      })
      .catch(callback);
});

seneca.add({role: 'stores-management', resource:'store', cmd: 'PUT'}, (args, callback) => {

  if (!args.body){
    callback("Missing store data in body")
  }

  if (!args.storeId){
    callback("Missing storeId")
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
    callback("Missing storeId")
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
    callback("Missing storeId id in url")
  }

  const params = {
    id: args.storeId,
    select: 'stock'
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
    .then(_.property('stock'))
    .then(stock => {
      const productIds = _.map(stock, 'productId');
      const params = {
        where: {_id: {$in: productIds}},
        select: 'name description img'
      };
      return Promise.props({
        stock,
        products: act({role: 'products', cmd: 'read'}, params)
      });
    })
    .then(result => {
      const stock = result.stock;
      const products = result.products;
      const stockWithProducts = _.map(stock, productStock => {
        const productId = productStock.productId;
        const stockWithProduct = _.omit(productStock, 'productId');
        stockWithProduct.product = _.find(products, {_id: productId});
        return stockWithProduct;
      });

      callback(null, stockWithProducts);
    })
    .catch(callback);
});

seneca.add({role: 'stores-management', resource:'products', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback("Missing storeId id in url");
  }

  if (!args.body){
    callback("Missing store data in body");
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
    callback("Missing storeId id in url")
  }

  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
    .then(store => {
      const params = {
        where: {_id: {$in: store.campaignIds}}
      };
      return act({role: 'campaigns', cmd: 'read'}, params)
    })
    .then(campaigns => {
      callback(null, campaigns);
    })
    .catch(callback);
});

seneca.add({role: 'stores-management', resource:'campaigns', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback("Missing storeId id in url");
  }

  if (!args.body){
    callback("Missing campaigns data in body");
  }

  const params = {
    id: args.storeId
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        var newCampaignIds = args.body;
        if (result.campaignIds){
          newCampaignIds = result.campaignIds.concat(newCampaignIds)
        }
        const updatedStore = Object.assign({}, result, {campaignIds: newCampaignIds})

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
    callback("Missing storeId id in url")
  }

  //FIXME select: 'stock'   REMOVE .select('-__v')
  const params = {
    id: args.storeId
  }

  act({role: 'stores', cmd: 'read', type:'id'}, params)
    .then(store => {
      const params = {
        where: {_id: {$in: store.adIds}}
      };
      return act({role: 'ads', cmd: 'read'}, params)
    })
    .then(ads => {
      callback(null, ads);
    })
    .catch(callback);
});

seneca.add({role: 'stores-management', resource:'ads', cmd: 'PUT'}, (args, callback) => {

  if (!args.storeId){
    callback("Missing storeId id in url");
  }

  if (!args.body){
    callback("Missing store data in body");
  }

  const params = {
    id: args.storeId
  };

  act({role: 'stores', cmd: 'read', type:'id'}, params)
      .then(result => {
        var newAdIds = args.body;
        if (result.adIds){
          newAdIds = result.adIds.concat(newAdIds)
        }
        const updatedStore = Object.assign({}, result, {adIds: newAdIds})

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

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

function setupStubs(seneca){
  seneca.stub('role:stores', (args, cb) => {
    cb(null, args)
  });

  seneca.stub('role:stores,cmd:read,type:id', (args, cb) => {
    cb(null, {
      _id: args.id,
      name: 'La Birreria',
      ownerId: '58167342593b55ac37e45490',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 90}
      ],
      locations: ['laBirreria:main'],
      adIds: ['8735ac37e44549025953b516', 'c37e4454902595735a3b5'],
      campaignIds: ['c33b557e445490295735a', 'c37e445490295735a3b55']
    })
  });
}


module.exports.seneca = seneca;
