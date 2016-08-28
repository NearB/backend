'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const cors = require('cors');

//TODO FIXME
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const reply = (promise, connection) => {
  promise
      .then(result => {
        connection.json({result: result});
      })
      .catch(err => {
        connection.json({err: err});
      });
};

const plain = (req) => {
  return {params: Object.assign({}, req.params, req.query), body: req.body};
};

const act = Promise.promisify(seneca.act, {context: seneca});

// Process APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_management_PORT,
  pin: {role: 'stores-management'}
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.warehouse_PORT,
  pin: {role: 'warehouse'}
});

module.exports = (app) => {
  //TODO review if necessary to declare 'use' AND cors by route to enable preflight
  app.options('/api/stores', cors(corsOptions));
  app.options('/api/stores/:id', cors(corsOptions));
  app.options('/api/stores/:id/stock', cors(corsOptions));


  app.post('/api/stores',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'stores-management', cmd: 'create', store: req.body}), res);
      });

  //TODO request authentication token to provide access only to current user stores
  app.get('/api/stores',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'stores-management', cmd: 'list'}), res);
      });

  app.put('/api/stores/:id?',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'stores-management', cmd: 'update'}, plain(req)), res);
      });

  app.get('/api/stores/:id',
      cors(corsOptions), (req, res) => {
        act({role: 'stores-management', cmd: 'info', id: req.params.id})
            .then(info => {
              act({role: 'warehouse', cmd: 'stock', type: "store", store: req.params.id})
                  .then(stock => {
                    const store = Object.assign({}, info, {content: stock});
                    res.json({result: store});
                  })
                  .catch(err => {
                    res.json({err: err});
                  });
            })
            .catch(err => {
              res.json({err: err});
            });
      });

  app.get('/api/stores/:id/info',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'stores-management', cmd: 'info', id: req.params.id}), res);
      });

  app.get('/api/stores/:id/stock',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'warehouse', cmd: 'stock', type: "store", store: req.params.id}), res);
      });

  //TODO request authentication token to provide access only to current user stock
  app.get('/api/stock',
      cors(corsOptions), (req, res) => {
        reply(act({role: 'warehouse', cmd: 'stock'}, plain(req)), res);
      });

  app.delete('/api/stores/:id?', (req, res) => {
    reply(act({role: 'stores-management', cmd: 'delete'}, plain(req)), res);
  });

  app.delete('/api/stores/:store/stock/:id', (req, res) => {
    reply(act({role: 'warehouse', cmd: 'delete'}, plain(req)), res);
  });

};
