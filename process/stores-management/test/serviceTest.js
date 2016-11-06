'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3112;


var test = require('tape');
var seneca = require('../service').seneca;

const product = {
  productId: 'bfa3d5dadbca53c781b13aa4',
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
  locations: ['laBirreria:main'],
  adIds: ['8735ac37e44549025953b516', 'c37e4454902595735a3b5'],
  campaignIds: ['c33b557e445490295735a', 'c37e445490295735a3b55']
};


test('test GET stores - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'stores', cmd: 'GET'},{},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});


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


test('test GET store by id', (t) => {
  t.plan(2);

  seneca.act({role: 'stores-management', resource:'store', cmd: 'GET'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result._id, store._id, "mapped id");
  });
});


test('test PUT store', (t) => {
  t.plan(4);

  //Update store info
  const newLocations = store.locations.concat(['laBirreria:patio']);
  const partial = {
    locations: newLocations
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


test('test GET store products', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'products', cmd: 'GET'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "two products");
    t.equal(result[0].productId, store.stock[0].productId, "found expected product");
  });
});


test('test GET store campaigns', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'campaigns', cmd: 'GET'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "two products");
    t.equal(result[0], store.campaignIds[0], "found expected campaignTag");
  });
});


test('test GET store ads', (t) => {
  t.plan(3);

  seneca.act({role: 'stores-management', resource:'ads', cmd: 'GET'},
  {
    storeId: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "two products");
    t.equal(result[0], store.adIds[0], "found expected adTag");
  });
});


test('test PUT store products', (t) => {
  t.plan(3);

  const partial = store.stock.concat(product);
  const newStore = Object.assign({}, store, {stock: partial});

  seneca.act({role: 'stores-management', resource:'products', cmd: 'PUT'},
  {
    storeId: store._id,
    body: product
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, newStore._id, "updated correct store");
    t.looseEquals(result.doc, newStore, "updated store with stock");
  });
});


test('test PUT store campaigns', (t) => {
  t.plan(3);

  const newIds = ['8454902519535ac37e43b567', '8453549025195ac37e43b567']
  const partial = store.campaignIds.concat(newIds);
  const newStore = Object.assign({}, store, {campaignIds: partial});

  seneca.act({role: 'stores-management', resource:'campaigns', cmd: 'PUT'},
  {
    storeId: store._id,
    body: newIds
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, newStore._id, "updated correct store");
    t.looseEquals(result.doc, newStore, "updated store with stock");
  });
});


test('test PUT store ads', (t) => {
  t.plan(3);

  const newIds = ['81953b56735ac37e44549025', '845490251953b56735ac37e4']
  const partial = store.adIds.concat(newIds);
  const newStore = Object.assign({}, store, {adIds: partial});

  seneca.act({role: 'stores-management', resource:'ads', cmd: 'PUT'},
  {
    storeId: store._id,
    body: newIds
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, newStore._id, "updated correct store");
    t.looseEquals(result.doc, newStore, "updated store with stock");
  });
});


test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
