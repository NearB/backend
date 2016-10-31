'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3001;

// Necessary for using mockgoose connection wrapper
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;

test('action1 test', function(t) {
  t.plan(2);
  seneca.act({role: 'service1', cmd: 'action1'}, function(err, result) {
    t.equal(err, null);
    t.equal('data', result.data);
  });
});

test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
