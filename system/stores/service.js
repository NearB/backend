'use strict';

var Promise = require('bluebird');
var seneca = require('seneca')();
var mongoose = require('./mongoose');

var Store = require('./models').Store;

var act = Promise.promisify(seneca.act, {context: seneca});

function successCallback(callback) {
  return function (res) {
    return callback.call(this, null, res);
  }
}

seneca.add({role: 'stores', cmd: 'list'}, function(args, callback) {
  Store.find()
    .select('name')
    .lean()
    .then(function (res) { return {data: res}; })
    .then(successCallback(callback))
    .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

// Bootstrap some random stores
mongoose.connection.once('open', function() {
  var stores = [
    {name: 'Starbucks'},
    {name: 'Güll'},
    {name: 'Barbas'},
    {name: 'PH\'s'}
  ];

  Store.count()
    .then(function (count) {
      if (!count) return Store.create(stores);
    })
    .then(function () { console.log('Bootstrap ok'); })
    .catch(function (err) { console.log(err); });
});

module.exports.seneca = seneca;
