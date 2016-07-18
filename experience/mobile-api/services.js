'use strict';
var Promise = require('bluebird');
var seneca = require('seneca')();
var _ = require('underscore');

var act = Promise.promisify(seneca.act, {context: seneca});


// Process APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.location_PORT,
  pin: 'role:location'
});

module.exports = (app) => {

  app.get('/api/location/list', (req, res) => {

    act({role: 'location', cmd: 'list'})
      .then(result => {
        res.send({result: result});
      })
      .catch(err => {
        res.send({err: err});
      });
  });

  app.get('/api/location/status', (req, res) => {

    act({role: 'location', cmd: 'status'})
      .then(result => {
        console.log(result);
        res.send({result: result});
      })
      .catch(err => {
        console.log(err);
        res.send({err: err});
      });
  });

  app.post('/api/location/learn', (req, res) => {

    console.log(req.body);
    console.log(req.params);
    act({role: 'location', cmd: 'learn', ap:req.body})
      .then(result => {
        console.log(result);
        res.send({result: result});
      })
      .catch(err => {
        console.log(err);
        res.send({err: err});
      });
  });
};
