'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3112;


var test = require('tape');
var seneca = require('../service').seneca;

const product = {
  productId: '5dadbca53cbfa3d781b13aa4',
  price: 12,
  stock: 20
};

const store = {
  _id: '5dadbca53cbfa3d781b13aa4',
  name: 'La Birreria',
  ownerId: '58167342593b55ac37e45490',
  stock: [
    {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
    {productId: '816735ac37e44549025953b5', price: 75, stock: 90}
  ],
  locations: ['737e45816454902593b55ac3'],
  adTags: ['birthDay', 'beerWithBurguer'],
  campaignTags: ['openingMonth', 'largeGroups']
}


test('test POST store', (t) => {
  t.plan(2);

  seneca.act({role: 'stores-management', resource:'stores', cmd: 'POST'},
  {
    body: store
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.store, store, "mapped store");
  });
});


test('test GET stores - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'stores', cmd: 'GET'},{},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});



test('test GET store by id', (t) => {
  t.plan(4);

  seneca.act({role: 'stores-management', resource:'store', cmd: 'GET'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, store._id, "mapped id");
    t.false(result.select, "no select");
    t.false(result.ops, "no options");
  });
});


test('test PUT store', (t) => {
  t.plan(4);

  //Update store info
  store.locations = store.locations.concat(['737e4581645593b55ac34902']);
  const partial = {
    locations: store.locations
  };

  seneca.act({role: 'stores-management', resource:'store', cmd: 'PUT'},
  {
    storeId: store._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, store._id, "mapped id");
    t.looseEquals(result.doc, partial, "partial as doc");
    t.false(result.ops, "no options");
  });
});


test('test DELETE store', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'store', cmd: 'DELETE'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, store._id, "mapped id");
    t.false(result.ops, "no options");
  });
});


test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
