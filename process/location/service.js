'use strict';

var Promise = require('bluebird');
var seneca = require('seneca')();

var act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_PORT,
  pin: 'role:stores'});


seneca.add({role: 'location', cmd: 'list'}, function(args, callback) {
  
  act({role: 'stores', cmd: 'list'})
    .then( function (result) {
      // Perform some aggregation / transformation on the results
      var locationResult = {
        timestamp: new Date(),
        stores: result
      };

      callback(null, locationResult);
    })
    .catch( callback );
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
