'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3001;
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;

const user = {
  username: "user001",
  name: "001 user",
  stores: ["000001"],
  filters: [],
  fbId: ""
};

//=========== TESTS ARE SECUENTIAL, KEEP THAT IN MIND ===========

test('test users create', (t) => {
  t.plan(3);

  seneca.act({role: 'users', cmd: 'create'}, {user: user},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.username, user.username, "same user");
    t.ok(result._id, "added id");
    //Hackish
    user._id = result._id;
  });
});

test('test users read all', (t) => {
  t.plan(3);
  seneca.act({role: 'users', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 1, "only created user found");
    t.same(result[0], user, "same user");
  });
});

test('test users read by id', (t) => {
  t.plan(3);

  seneca.act({role: 'users', cmd: 'read', type:'id'},
  {
    id: user._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "user found");
    t.same(result, user, "same user");
  });
});

test('test users update by id', (t) => {
  t.plan(4);

  //Update user document
  user.name = user.name + ' updated';
  user.filters = ['updated'];

  //Update in the DB
  seneca.act({role: 'users', cmd: 'update', type:'id'},
  {
    id: user._id,
    doc: user
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.same(result, user, "Returned modified user after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'users', cmd: 'read', type:'id'},
    {
      id: user._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.same(result, user, "Updated user matched");
    });
  });
});

test('test users delete by id', (t) => {
  t.plan(2);

  seneca.act({role: 'users', cmd: 'delete', type:'id'},
  {
    id: user._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.same(result, user, "same user");
  });
});

test('test users read after delete', (t) => {
  t.plan(2);

  seneca.act({role: 'users', cmd: 'read', type:'id'},
  {
    id: user._id
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
