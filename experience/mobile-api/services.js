'use strict';
var Promise = require('bluebird');
var seneca = require('seneca')();
var _ = require('underscore');
const cors = require('cors');

//TODO FIXME
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const reply = (promise, connection) => {
  promise
      .then(result => {
        connection.json({data: result});
      })
      .catch(err => {
        connection.json({err: err});
      });
};

const plain = (req) => {
  return Object.assign({}, req.params, req.query, {body: req.body});
};


var act = Promise.promisify(seneca.act, {context: seneca});

// Process APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.location_PORT,
  pin: 'role:location'
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.accounts_PORT,
  pin: 'role:accounts'
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.engagement_PORT,
  pin: 'role:engagement'
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_management_PORT,
  pin: 'role:stores-management'
});


module.exports = (app) => {

  //TODO review if necessary to declare 'use' AND cors by route to enable preflight
  app.options('/api/locate', cors(corsOptions));
  app.options('/api/locations', cors(corsOptions));
  app.options('/api/locations/:locationId', cors(corsOptions));
  app.options('/api/carts', cors(corsOptions));
  app.options('/api/carts/:cartId', cors(corsOptions));
  app.options('/api/users', cors(corsOptions));
  app.options('/api/users/:userId', cors(corsOptions));
  app.options('/api/stores', cors(corsOptions));
  app.options('/api/stores/:storeId', cors(corsOptions));
  app.options('/api/promotions', cors(corsOptions));

// =============== stores-management ===============

  // =============== ?locations=locaitonId1,locationId2 ===============
  // =============== ?beacons=?24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16,32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
  app.get('/api/stores', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'stores', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/store/:storeId', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'store', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/store/:storeId', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'store', cmd: req.method}, plain(req)), res);
  });

  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.get('/api/store/:storeId/products', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'products', cmd: req.method}, plain(req)), res);
  });

// =============== accounts ===============

  app.post('/api/users', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'users', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/user/:userId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'user', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/user/:userId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'user', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/user/:userId/alerts', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'alerts', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/user/:userId/alerts', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'alerts', cmd: req.method}, plain(req)), res);
  });


// =============== engagement ===============

// =============== ?tags=tag01,tag02 ===============
// =============== ?locations=locaitonId1,locationId2 ===============
// =============== ?beacons=?24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16,32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
  app.get('/api/promotions', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'promotions', cmd: req.method}, plain(req)), res);
  });

  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.post('/api/carts/', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'carts', cmd: req.method}, plain(req)), res);
  });

  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.get('/api/carts/:cartId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'cart', cmd: req.method}, plain(req)), res);
  });

  // =============== ?checkout=true ===============
  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.put('/api/carts/:cartId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'cart', cmd: req.method}, plain(req)), res);
  });

  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.delete('/api/carts/:cartId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'cart', cmd: req.method}, plain(req)), res);
  });

  // =============== ?quantity=1 ===============
  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.put('/api/carts/:cartId/products/:productId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'product', cmd: req.method}, plain(req)), res);
  });

  // =============== ?engagement=J1qK1c18UUGJFAzz9xnH56584l4 ===============
  app.delete('/api/carts/:cartId/products/:productId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'engagement', resource:'product', cmd: req.method}, plain(req)), res);
  });


// =============== location ===============

  app.put('/api/locations', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'locations', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/locations', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'locations', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/locations/:locationId', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'location', cmd: req.method}, plain(req)), res);
  });

// =============== locate ===============
  // =============== ?beacons=24%3Aa4%3A3c%3A9e%3Ad2%3A84%3D16,32%3Aa4%3A3c%3A9e%3Ad2%3A84%3D10 ===============
  // =============== ?username=someusername ===============
  app.get('/api/locate', cors(corsOptions), cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'locate', cmd: req.method}, plain(req)), res);
  });
};
