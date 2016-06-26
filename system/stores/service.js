'use strict';

var Promise = require('bluebird');
var seneca = require('seneca')();

var act = Promise.promisify(seneca.act, {context: seneca});

seneca.add({role: 'stores', cmd: 'list'}, function(args, callback) {
  callback(null, {data: ['Starbucks', 'Güll', 'Barbas', 'PH\'s']});
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
