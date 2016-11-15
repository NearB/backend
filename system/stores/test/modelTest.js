'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3101;

// Necessary for using mockgoose connection wrapper
process.env.TESTING = true;

var test = require('tape');
var Store = require('../models').Stores.Store;

const store = {
  name: 'Barbas',
  ownerId: '581673454902593b55ac37e4',
  stock: [],
  adIds: [],
  campaignIds: []
};

//=========== TESTS ARE SECUENTIAL, KEEP THAT IN MIND ===========

test('test store create without locations', (t) => {
  t.plan(4);

  new Store(store)
    .save( (err, savedStore) => {
      t.ifErr(err, 'errors occured');
      t.ok(savedStore.locations, 'locations array created');
      t.equal(savedStore.locations.length, 1, 'one location created by default');
      t.equal(savedStore.locations[0], 'barbas:main', 'created location by default is main');
      savedStore.remove();
    });
});
