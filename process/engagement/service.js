'use strict';

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
    port: process.env.stores_management_PORT,
    pin: {role: 'marketing'}
  });

  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.stores_PORT,
    pin: {role: 'cart'}
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

// =============== /promotions ===============
// =============== ?tags=one,two ===============
// =============== ?locations=id1,id2 ===============
// =============== ?beacons=18ui239u,18u2239u ===============
seneca.add({role: 'engagement', resource:'promotions', cmd: 'GET'}, (args, callback) => {

  if (!args.beacons){
    //FIXME
    callback("Missing beacons");
  }

  const params = {
    beacons: args.beacons
  };

  act({role: 'location', resource:'discover', cmd: 'GET'}, params)
      .then(stores => {
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
            callback(null, [].concat.apply([], ads));
          })
          .catch(callback);
      })
      .catch(callback);
});

// =============== /engagement ===============
// =============== ?userId=937e45902b55581673454ac3&storeId=51673454902b55ac37e45938 ===============
seneca.add({role: 'engagement', resource:'engage', cmd: 'POST'}, (args, callback) => {

  if (!args.userId){
    callback("Missing userId");
  }

  if (!args.storeId){
    callback("Missing storeId");
  }

  //TODO make token actually a token and not two string concatenated
  const token = encodeURI(`${args.userId}:${args.storeId}`);
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

  if (!args.engagement){
    callback("Missing engagement token");
  }
  //TODO validate token is valid client and store ids

  const params = {
    cart: createCart(args.engagement)
  }

  act({role: 'cart', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== /carts/{cartId} ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'GET'}, (args, callback) => {

  if (!args.cartId){
    callback("Missing cart Id");
  }

  if (!args.engagement){
    callback("Missing engagement token");
  }
  //TODO validate token is valid client and store ids


  act({role: 'cart', cmd: 'read', type:'id'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== ?checkout=true ===============
// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'PUT'}, (args, callback) => {

  if (!args.cartId){
    callback("Missing cart Id");
  }

  if (!args.body){
    callback("Missing body for update");
  }

  if (!args.engagement){
    callback("Missing engagement token");
  }
  //TODO validate token is valid client and store ids

  const params = {
    id: args.cartId,
    doc: args.body
  }

  act({role: 'cart', cmd: 'update', type:'id'}, params)
      .then(cart => {

        if (args.checkout){
          const deleteParams = {
            id: cart._id
          };

          // TODO
          // trigger payment and notify store
          //
          // don't delete the cart yet, but flag it as pending for removal
          // once the payment is completed
          console.log("Pending checkout");
        }

        callback(null, cart);
      })
      .catch(callback);
});

// =============== ?engagement=58169988e7be135e5369225c:587be135e5369225c169988e ===============
seneca.add({role: 'engagement', resource:'cart', cmd: 'DELETE'}, (args, callback) => {

  if (!args.cartId){
    callback("Missing cart Id");
  }

  if (!args.engagement){
    callback("Missing engagement token");
  }
  //TODO validate token is valid client and store ids

  const params = {
    id: args.cartId
  }

  act({role: 'cart', cmd: 'delete', type:'id'}, params)
      .then(result => {
        callback(null, result);
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
