'use strict';
var Promise = require('bluebird');
var seneca = require('seneca')();

var act = Promise.promisify(seneca.act, {context: seneca});

// Process APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.location_PORT,
  pin: 'role:location'});

module.exports = function (app) {

  app.get('/api/location/list', function (req, res) {
    act({role: 'location', cmd: 'list'})
      .then( function (result) {
        res.send({result: result});
      })
      .catch( function (err) {
        res.send({err: err});        
      });
  });
};
