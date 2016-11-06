'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3011;


var test = require('tape');
var seneca = require('../service').seneca;

const firstFP = {
  mac: 'ee:94:f6:c4:14:b1',
  rssi: -44
};

const secondFP = {
  mac: '74:94:f6:c4:14:b6',
  rssi: -80
};

const encondedBeacons = encodeURI(`${firstFP.mac}=${firstFP.rssi},${secondFP.mac}=${secondFP.rssi}`);
const engagementToken = '58169988e7be135e5369225c:587be135e5369225c169988e';
const userId = '58169988e7be135e5369225c';
const storeId = '587be135e5369225c169988e';


const firstCartProduct = {
  productId: '5e5369587be13225c169988e', //To be populated on product create
  quantity: 2,
  price: 5
};

const secondCartProduct = {
  productId: '5e5369587be25c169988e132', //To be populated on product create
  quantity: 20,
  price: 1
};

const cart = {
  _id: '5e5369587be25c1699e13288',
  total: 10,
  engagement: '58169988e7be135e5369225c:587be135e5369225c169988e',
  products: [firstCartProduct],
  discount: 0
};



test('test GET promotions from beacon', (t) => {
  t.plan(5);

  const expectedIds = ['51673454902b55ac37e45938', '937e45902b55581673454ac3', '581673454902b55ac37e4593'];

  seneca.act({role: 'engagement', resource:'promotions', cmd: 'GET'},
  {
    beacons: encondedBeacons
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 3, 'Three ads found');

    result.forEach(ad => {
      t.ok(expectedIds.includes(ad._id), `Found ad id ${ad._id}`);
    });
  });
});


test('test POST engagement ', (t) => {
  t.plan(3);

  seneca.act({role: 'engagement', resource:'engage', cmd: 'POST'},
  {
    userId: userId,
    storeId: storeId
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.token, engagementToken, 'Correct token generated');
    t.ok(result.cartId, 'Created cart');
  });
});


test('test POST carts', (t) => {
  t.plan(3);

  seneca.act({role: 'engagement', resource:'carts', cmd: 'POST'},
  {
    engagement: engagementToken
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.products.length, 0, 'Created empty cart');
    t.equal(result.engagement, engagementToken, 'With token');
  });
});


test('test PUT cart', (t) => {
  t.plan(3);

  const partial = cart.products.concat(secondCartProduct);

  seneca.act({role: 'engagement', resource:'cart', cmd: 'PUT'},
  {
    engagement: engagementToken,
    cartId: cart._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, cart._id);
    t.looseEquals(result.doc, partial);
  });
});

test('test DELETE cart', (t) => {
  t.plan(2);

  seneca.act({role: 'engagement', resource:'cart', cmd: 'DELETE'},
  {
    engagement: engagementToken,
    cartId: cart._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, cart._id, 'Deleted the correct cart');
  });
});

test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
