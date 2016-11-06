'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3101;

// Necessary for using mockgoose connection wrapper
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;

const firstProductStock = {
  productId: '5816733b55ac37e445490259',
  price: 75,
  stock: 100
};

const secondProductStock = {
  productId: '5ac37e4454902595816733b5',
  price: 75,
  stock: 100
};

const store = {
  name: 'Barbas',
  ownerId: '581673454902593b55ac37e4',
  stock: [firstProductStock, secondProductStock],
  locations: ['barbas:main', 'barbas:reception'],
  adIds: [],
  campaignIds: []
};

//=========== TESTS ARE SECUENTIAL, KEEP THAT IN MIND ===========

test('test store create', (t) => {
  t.plan(3);

  seneca.act({role: 'stores', cmd: 'create'}, {store: store},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.name, store.name, "same store");
    t.ok(result._id, "added id");
    //Hackish
    store._id = result._id;
  });
});

test('test stores read all', (t) => {
  t.plan(3);
  seneca.act({role: 'stores', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 1, "only created store found");
    t.same(result[0], store, "same store");
  });
});

test('test stores read by id', (t) => {
  t.plan(3);

  seneca.act({role: 'stores', cmd: 'read', type:'id'},
  {
    id: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "store found");
    t.same(result, store, "same store");
  });
});


test('test stores update by id', (t) => {
  t.plan(4);

  //Update store info
  firstProductStock.stock = firstProductStock.stock - 1;
  const partial = {
    // no partial array update for now, sorry folks
    stock: [firstProductStock, secondProductStock],
    adIds: ['581673454902b55ac37e4593', '902b55581673454ac37e4593']
  };

  store.stock = [firstProductStock, secondProductStock];
  store.adIds = ['581673454902b55ac37e4593', '902b55581673454ac37e4593'];

  //Update in the DB
  seneca.act({role: 'stores', cmd: 'update', type:'id'},
  {
    id: store._id,
    doc: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.same(result, store, "Returned modified store after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'stores', cmd: 'read', type:'id'},
    {
      id: store._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.same(result, store, "Updated store matched");
    });
  });
});

test('test stores delete by id', (t) => {
  t.plan(2);

  seneca.act({role: 'stores', cmd: 'delete', type:'id'},
  {
    id: store._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.same(result, store, "same store");
  });
});

test('test stores read after delete', (t) => {
  t.plan(2);

  seneca.act({role: 'stores', cmd: 'read', type:'id'},
  {
    id: store._id
  },
  (err, result) => {
    t.notOk(err, "no errors");
    t.notOk(result, "check no records");
  });
});

test('shutdown', (t) => {
  t.plan(1);
  t.equal(1, 1, "Tests Completed");
  setTimeout(function() { process.exit(0); }, 100);
});
