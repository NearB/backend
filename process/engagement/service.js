'use strict';

var _ = require('underscore');
const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  setupStubs(seneca);

} else {
  // Process APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.location_PORT,
    pin: {role: 'location'}
  });
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.marketing_PORT,
    pin: {role: 'marketing'}
  });

  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'cart'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'carts'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'products'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'order'}
  });

  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.products_PORT,
    pin: {role: 'orders'}
  });
}

function createCart(engagementToken){
  return {
    total: 0,
    engagement: engagementToken,
    products: [],
    discount: 0
  }
}

function createOrder(cartId, products, engagementToken){
  return {
    cartId: cartId,
    engagement: engagementToken,
    status: 'PENDING',
    products: products
  }
}

function createToken(userId, storeId, adId){
  let token = `${userId}:${storeId}:${new Date().getMilliseconds()}`;
  if (adId != null){
    token = token.concat(`:${adId}`);
  }
  return encodeURI(token);
}

const CART_STATUS = {OPEN:'OPEN', PENDING_CHECKOUT:'CHECKOUT', CLOSED:'CLOSED'}
const ORDER_STATUS = {PENDING:'PENDING', DONE:'DONE', CANCELED:'CANCELED'}

//TODO validate token EVERYWHERE

// =============== /promotions ===============
// =============== ?tags=one,two ===============
// =============== ?locations=id1,id2 ===============
// =============== ?beacons=18ui239u,18u2239u ===============

// === FIXME this shouldn't be necessary ============ ?userId=18ui239u18u2239u ===============
seneca.add({role: 'engagement', resource:'promotions', cmd: 'GET'}, (args, callback) => {

  if (args.beacons == null){
    callback("Missing beacons");
  }

  const params = {
    beacons: args.beacons
  };

  act({role: 'location', resource:'discover', cmd: 'GET'}, params)
      .then(stores => {
        const adOriginMap = new Map();
        stores.forEach(store => store.adIds.forEach(id => adOriginMap.set(id, store._id)));

        var adIds = stores.map(store => {
          return store.adIds;
        }).filter(ads => ads.length > 0);

        adIds = [].concat.apply([], adIds);
        const adsForNearbyStores = adIds.map(id => {
          return act({role: 'marketing', resource: 'ad', cmd: 'GET'},
                     { adId: id });
        });

        Promise.all(adsForNearbyStores)
          .then(ads => {
            console.log(ads);
            const tokenizedAds = ([].concat.apply([], ads)).map(ad => {
              const engagement = createToken(args.userId, adOriginMap.get(ad._id), ad._id);
              return Object.assign({}, ad, {engagementToken: engagement});
            });

            callback(null, tokenizedAds);
          })
          .catch(callback);
      })
      .catch(callback);
});

// =============== /engagement ===============
// =============== ?userId=937e45902b55581673454ac3&storeId=51673454902b55ac37e45938 ===============
seneca.add({role: 'engagement', resource:'engage', cmd: 'POST'}, (args, callback) => {

  if (args.userId == null){
    callback("Missing userId");
  }

  if (args.storeId == null){
    callback("Missing storeId");
  }

  //TODO make token actually a token and not two string concatenated
  const token = createToken(args.userId, args.storeId);
  const params = {
    cart: createCart(token)
  }

  act({role: 'cart', cmd: 'create'}, params)
      .then(result => {

        //TODO notify store that a costumer entered
        const engagementResult = {
          cartId: result._id,
          token: token
        };

        callback(null, engagementResult);
      })
      .catch(callback);
});


// =============== /carts ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'carts', cmd: 'POST'}, (args, callback) => {

  const params = {
    cart: createCart(args.engagement)
  }

  act({role: 'cart', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /stores/{storeId}/carts ===============
// =============== ?status=OPEN|CHECKOUT|CLOSED ===============
seneca.add({role: 'engagement', resource:'carts', cmd: 'GET'}, (args, callback) => {

  if (args.storeId == null){
    callback("Missing storeId");
  }

  const query = {
    where: { storeId: args.storeId }
  };

  if (args.status != null){
      const requesteStatuses = args.status.toUpperCase().split(',');
      query.where['status'] = {$in: requesteStatuses};
  }

  act({role: 'cart', cmd: 'read'}, query)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});


// =============== /carts/{cartId} ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'GET'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  act({role: 'cart', cmd: 'read', type:'id'}, {id: args.cartId})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /carts/{cartId} ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'PUT'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  if (args.body == null){
    callback("Missing body for update");
  }

  //TODO validate token is valid client and store ids

  const params = {
    id: args.cartId,
    doc: args.body
  }

  act({role: 'cart', cmd: 'read', type:'id'}, {id: args.cartId})
      .then(cart => {
        console.log(cart);
        if (cart.status.toUpperCase() == CART_STATUS.OPEN){
          act({role: 'cart', cmd: 'update', type:'id'}, params)
              .then(updatedCart => {
                callback(null, updatedCart);
              })
              .catch(callback);
        } else {
          if (cart.status.toUpperCase() == CART_STATUS.PENDING_CHECKOUT &&
              params.doc.status.toUpperCase() == CART_STATUS.CLOSED)
          {
            act({role: 'cart', cmd: 'update', type:'id'}, params)
                .then(updatedCart => {
                  callback(null, updatedCart);
                })
                .catch(callback);
          } else {
            callback(`Cart status was ${cart.status}, no further updates can be made`);
          }
        }
      })
      .catch(callback);
});

// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'DELETE'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  const params = {
    id: args.cartId
  }

  act({role: 'cart', cmd: 'read', type:'id'}, params)
      .then(cart => {
        if (cart.status.toUpperCase() == CART_STATUS.CLOSED){
          act({role: 'cart', cmd: 'delete', type:'id'}, params)
              .then(deletedCart => {
                callback(null, deletedCart);
              })
              .catch(callback);
        } else {
            if (cart.status.toUpperCase() == CART_STATUS.PENDING_CHECKOUT){
              callback("Cart has a pending Checkout");
            } else {
              callback("Cart is still Open");
            }
        }
      })
      .catch(callback);
});


// =============== /stores/{storeId}/orders ===============
// =============== ?status=OPEN|CHECKOUT|CLOSED ===============
seneca.add({role: 'engagement', resource:'orders', cmd: 'GET'}, (args, callback) => {

  if (args.storeId == null){
    callback("Missing storeId");
  }

  const query = {
    where: { storeId: args.storeId }
  };

  if (args.status != null){
      const requesteStatuses = args.status.toUpperCase().split(',');
      query.where['status'] = {$in: requesteStatuses};
  }

  act({role: 'order', cmd: 'read'}, query)
    .then(result => {
      callback(null, result);
    })
    .catch(callback);
});


// =============== /carts/{cartId}/products ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'products', cmd: 'GET'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  if (args.engagement == null){
    callback("Missing engagement token");
  }
  //TODO validate token is valid client and store ids

  act({role: 'cart', cmd: 'read', type:'id'}, {id: args.cartId})
    .then(_.property('products'))
    .then(cartProducts => {
      const productIds = _.map(cartProducts, 'productId');
      const params = {
        where: {_id: {$in: productIds}},
        select: 'name description img'
      };
      return Promise.props({
        cartProducts,
        productDetails: act({role: 'products', cmd: 'read'}, params)
      });
    })
    .then(result => {
      const cartProducts = result.cartProducts;
      const productDetails = result.productDetails;
      const productsWithDetail = _.map(cartProducts, cartProduct => {
        const productId = cartProduct.productId;
        const cartProductWithDetail = _.omit(cartProduct, 'productId');
        cartProductWithDetail.product = _.find(productDetails, {_id: productId});
        return cartProductWithDetail;
      });

      callback(null, productsWithDetail);
    })
    .catch(callback);

});

// =============== carts/:cartId/products' ===============
// =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
// =============== &skipOrder ===============
seneca.add({role: 'engagement', resource:'products', cmd: 'PUT'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  if (args.body == null){
    callback("Missing body for update");
  }

  if (args.engagement == null){
    callback("Missing engagement token");
  }

  const updatedProducts = args.body;

  let updateTransaction;
  if (args.skipOrder != null){
    updateTransaction = (cart) => updateCartProducts(cart, updatedProducts);

  } else {
    updateTransaction = (cart) =>{
      const newOrder = createOrder(cart._id, updatedProducts, args.engagement);

      return act({role: 'order', cmd: 'create'}, {order: newOrder})
      .then(res => {
        return updateCartProducts(cart, updatedProducts);
      }).catch(callback);
    }
  }

  act({role: 'cart', cmd: 'read', type:'id'}, {id: args.cartId})
      .then(cart => {
        return updateTransaction(cart);
      })
      .then(updatedCart => {
        callback(null, updatedCart);
      })
      .catch(callback);
});

function updateCartProducts(cart, updatedProducts){
  updatedProducts = updatedProducts.map(updated => {
    let modifiedProd = cart.products.find(p => p.productId == updated.productId);
    if (modifiedProd == null){
      modifiedProd = {
        productId: updated.productId,
        price: updated.price,
        quantity: 0
      };
    }
    modifiedProd.quantity = +modifiedProd.quantity + +updated.quantity;
    return modifiedProd;
  });

  const nonUpdatedProducts = cart.products.filter(p => updatedProducts.find(i => i.productId == p.productId) == null);

  const finalProducts = nonUpdatedProducts.concat(updatedProducts);

  cart['total'] = finalProducts.length > 1
                    ? finalProducts.reduce((a, b)=> {return (+a.price * +a.quantity) + (+b.price * +b.quantity)})
                    : +finalProducts[0].price * +finalProducts[0].quantity;

  cart['products'] = finalProducts

  const params = {
    id: cart._id,
    doc: cart
  };

  return act({role: 'cart', cmd: 'update', type:'id'}, params);
}


// =============== carts/:cartId/products/:productId' ===============
// =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
seneca.add({role: 'engagement', resource:'product', cmd: 'PUT'}, (args, callback) => {

  if (args.cartId == null){
    callback("Missing cart Id");
  }

  if (args.body == null){
    callback("Missing body for update");
  }

  if (args.engagement == null){
    callback("Missing engagement token");
  }

  if (args.productId == null){
    callback("Missing product Id");
  }

  const cartProduct = args.body;
  act({role: 'cart', cmd: 'read', type:'id'}, {id: args.cartId})
      .then(cart => {

        let products = cart.products;
        let modifiedProd = cart.products.find(p => p.productId == cartProduct.productId);
        if (modifiedProd == null){
          modifiedProd = {
            productId: cartProduct.productId,
            price: cartProduct.price,
            quantity: 0
          };
        } else {
          products = products.splice(modifiedProd, 1);
        }

        modifiedProd.quantity = +modifiedProd.quantity + +cartProduct.quantity;

        cart['total'] = cart['total'] + cartProduct.quantity *1* cartProduct.price;
        cart['products'] = products.concat(modifiedProd);

        const params = {
          id: cart._id,
          doc: cart
        };

        console.log("UPDATING CART");
        console.log(cart);
        act({role: 'cart', cmd: 'update', type:'id'}, params)
            .then(cart => {
              callback(null, cart);
            })
            .catch(callback);
      })
      .catch(callback);
});


// =============== /orders/{orderId} ===============
seneca.add({role: 'engagement', resource:'order', cmd: 'GET'}, (args, callback) => {

  if (args.orderId == null){
    callback("Missing cart Id");
  }

  act({role: 'order', cmd: 'read', type:'id'}, {id: args.orderId})
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /orders/{orderId} ===============
seneca.add({role: 'engagement', resource:'order', cmd: 'PUT'}, (args, callback) => {

  if (args.orderId == null){
    callback("Missing cart Id");
  }

  if (args.body == null){
    callback("Missing body for update");
  }

  const params = {
    id: args.orderId,
    doc: args.body
  }

  act({role: 'order', cmd: 'read', type:'id'}, {id: args.orderId})
      .then(order => {
        if (order.status.toUpperCase() == ORDER_STATUS.PENDING){
          act({role: 'order', cmd: 'update', type:'id'}, params)
              .then(order => {
                callback(null, order);
              })
              .catch(callback);
        } else {
          callback(`Order status was ${order.status}, no further updates can be made`);
        }
      })
      .catch(callback);
});

// =============== /orders/{orderId} ===============
seneca.add({role: 'engagement', resource:'order', cmd: 'DELETE'}, (args, callback) => {

  if (args.orderId == null){
    callback("Missing cart Id");
  }

  const params = {
    id: args.orderId
  }

  act({role: 'order', cmd: 'read', type:'id'}, params)
      .then(order => {
        if (order.status.toUpperCase() != ORDER_STATUS.PENDING){
          act({role: 'order', cmd: 'delete', type:'id'}, params)
              .then(order => {
                callback(null, order);
              })
              .catch(callback);
        } else {
          callback("Order resolution is still pending");
        }
      })
      .catch(callback);
});



seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});


function setupStubs(seneca){

  seneca.stub('role:location', (args, cb) => {
    cb(null, args);
  });

  seneca.stub('role:location,resource:discover,cmd:GET', (args, cb) => {
    cb(null, [{
      name: 'DBox',
      ownerId: '816734549502593b55ac37e4',
      stock: [],
      locations: ['dBox:reception', 'dBox:tables', 'dBox:kitchen'],
      adIds: ['51673454902b55ac37e45938', '937e45902b55581673454ac3'],
      campaignTags: ['53454902b55ac37e45938167', '933454ac37e45902b5558167']
    },
    {
      name: 'La Birreria',
      ownerId: '58167342593b55ac37e45490',
      stock: [],
      locations: ['laBirreria:main'],
      adIds: ['581673454902b55ac37e4593'],
      campaignTags: []
    }]);
  });

  seneca.stub('role:marketing,resource:ad,cmd:GET', (args, cb) => {
    cb(null, {
      _id: args.adId,
      name: 'Happy Hour',
      img:'https://upload.wikimedia.org/wikipedia/en/9/93/Achille-mauzan-geniol.jpg',
      tags:['2x1', 'beer'],
      expiration: '1995-12-17T03:24:00'
    });
  });

  seneca.stub('role:cart,cmd:create', (args, cb) => {
    args.cart._id = '581673454902b55ac37e4593';
    cb(null, args.cart);
  });

  seneca.stub('role:cart', (args, cb) => {
    cb(null, args);
  });

}


module.exports.seneca = seneca;
