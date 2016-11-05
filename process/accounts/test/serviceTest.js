'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3012;


var test = require('tape');
var seneca = require('../service').seneca;

const ownerUser = {
  _id: '5dadbca53cbfa3b13aa4d781',
  username: 'ownerUser',
  name: 'Testing ownerUser User',
  stores: []
};

const clientUser = {
  _id: 'ca535dadbcbfa3b13aa4d781',
  username: 'clientUser',
  name: 'Testing clientUser User',
  filters: []
};


test('test POST user', (t) => {
  t.plan(4);

  seneca.act({role: 'accounts', resource:'users', cmd: 'POST'},
  {
    body: ownerUser
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.user, ownerUser, "mapped user");
  });

  seneca.act({role: 'accounts', resource:'users', cmd: 'POST'},
  {
    body: clientUser
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.user, clientUser, "mapped user");
  });
});


test('test GET users - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'accounts', resource:'users', cmd: 'GET'},
  {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});


test('test GET users - Filtered by preferences', (t) => {
  t.plan(3);

  seneca.act({role: 'accounts', resource:'users', cmd: 'GET'},
  {
    preferences: 'food,tv,creditCard'
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(
      result.where, {
        filters: {"$all": ['food', 'tv', 'creditCard']}
      } ,"provided tag filters");
    t.false(result.select, "no projection provided");
  });
});


test('test GET user by id', (t) => {
  t.plan(4);

  seneca.act({role: 'accounts', resource:'user', cmd: 'GET'},
  {
    userId: ownerUser._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, ownerUser._id, "mapped id");
    t.false(result.select, "no select");
    t.false(result.ops, "no options");
  });
});


test('test PUT owner user', (t) => {
  t.plan(4);

  //Update user info
  ownerUser.stores = ownerUser.stores.concat(['5dadbca13aa4d78153cbfa3b']);
  const partial = {
    stores: ownerUser.stores
  };

  seneca.act({role: 'accounts', resource:'user', cmd: 'PUT'},
  {
    userId: ownerUser._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, ownerUser._id, "mapped id");
    t.looseEquals(result.doc, partial, "partial as doc");
    t.false(result.ops, "no options");
  });
});


test('test PUT client user', (t) => {
  t.plan(4);

  //Update user info
  clientUser.filters = clientUser.filters.concat(['beer', 'food']);
  const partial = {
    filters: clientUser.filters
  };

  seneca.act({role: 'accounts', resource:'user', cmd: 'PUT'},
  {
    userId: clientUser._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, clientUser._id, "mapped id");
    t.looseEquals(result.doc, partial, "partial as doc");
    t.false(result.ops, "no options");
  });
});


test('test DELETE user', (t) => {
  t.plan(3);

  seneca.act({role: 'accounts', resource:'user', cmd: 'DELETE'},
  {
    userId: ownerUser._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, ownerUser._id, "mapped id");
    t.false(result.ops, "no options");
  });
});



test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
