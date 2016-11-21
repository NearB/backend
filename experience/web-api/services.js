'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();
const cors = require('cors');

//TODO FIXME
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const act = Promise.promisify(seneca.act, {context: seneca});

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
  port: process.env.marketing_PORT,
  pin: 'role:marketing'
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.warehouse_PORT,
  pin: 'role:warehouse'
});

seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.stores_management_PORT,
  pin: 'role:stores-management'
});

module.exports = (app) => {
  //TODO review if necessary to declare 'use' AND cors by route to enable preflight
  app.options('/api/stores', cors(corsOptions));
  app.options('/api/stores/:storeId', cors(corsOptions));
  app.options('/api/stores/:storeId/products', cors(corsOptions));
  app.options('/api/stores/:storeId/campaigns', cors(corsOptions));
  app.options('/api/stores/:storeId/ads', cors(corsOptions));
  app.options('/api/stores/:storeId/clients', cors(corsOptions));
  // app.options('/api/marketing', cors(corsOptions));
  app.options('/api/marketing/ads', cors(corsOptions));
  app.options('/api/marketing/ads/:adId', cors(corsOptions));
  app.options('/api/marketing/campaigns', cors(corsOptions));
  app.options('/api/marketing/campaigns/:campaignId', cors(corsOptions));
  app.options('/api/products', cors(corsOptions));
  app.options('/api/products/:productId', cors(corsOptions));
  app.options('/api/users', cors(corsOptions));
  app.options('/api/users/:userId', cors(corsOptions));
  app.options('/api/users/:userId/stores', cors(corsOptions));
  app.options('/api/locations', cors(corsOptions));
  app.options('/api/locations/:locationId', cors(corsOptions));


// =============== stores ===============

  app.get('/api/stores', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'stores', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/stores', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'stores', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/stores/:storeId', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'store', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/stores/:storeId', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'store', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/stores/:storeId', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'store', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/stores/:storeId/products', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'products', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/stores/:storeId/products', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'products', cmd: req.method}, plain(req)), res);
  });

  // TODO REVIEW MISSING ENDPOINTS

  app.get('/api/stores/:storeId/campaigns', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'campaigns', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/stores/:storeId/ads', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'ads', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/stores/:storeId/clients', cors(corsOptions), (req, res) => {
    reply(act({role: 'stores-management', resource:'clients', cmd: req.method}, plain(req)), res);
  });


// =============== marketing ===============

  app.get('/api/marketing/ads', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'ads', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/marketing/ads', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'ads', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/marketing/ads/:adId', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'ad', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/marketing/campaigns', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'campaigns', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/marketing/campaigns', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'campaigns', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/marketing/campaigns/:campaignId', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'campaign', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/marketing/campaigns/:campaignId', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'campaign', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/marketing/campaigns/:campaignId', cors(corsOptions), (req, res) => {
    reply(act({role: 'marketing', resource:'campaign', cmd: req.method}, plain(req)), res);
  });

// =============== products ===============

  app.get('/api/products', cors(corsOptions), (req, res) => {
    reply(act({role: 'warehouse', resource:'products', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/products', cors(corsOptions), (req, res) => {
    reply(act({role: 'warehouse', resource:'products', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/products/:productId', cors(corsOptions), (req, res) => {
    reply(act({role: 'warehouse', resource:'product', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/products/:productId', cors(corsOptions), (req, res) => {
    reply(act({role: 'warehouse', resource:'product', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/products/:productId', cors(corsOptions), (req, res) => {
    reply(act({role: 'warehouse', resource:'product', cmd: req.method}, plain(req)), res);
  });

// =============== accounts ===============

  // =============== TEMPORARY ENDPOINT UNTIL FB LOGIN ===============
  // =============== ?username=username ===============
  app.get('/api/users/:username', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'users', cmd: req.method, type:'username'}, plain(req)), res);
  });


  // =============== ?preferences=tag02,tag02 ===============
  app.get('/api/users', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'users', cmd: req.method}, plain(req)), res);
  });

  app.post('/api/users', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'users', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/users/:userId', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'user', cmd: req.method}, plain(req)), res);
  });

  app.put('/api/users/:userId', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'user', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/users/:userId', cors(corsOptions), (req, res) => {
    reply(act({role: 'accounts', resource:'user', cmd: req.method}, plain(req)), res);
  });


// =============== location ===============

  app.get('/api/locations', cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'locations', cmd: req.method}, plain(req)), res);
  });

  app.get('/api/locations/:locationId', cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'location', cmd: req.method}, plain(req)), res);
  });

  app.delete('/api/locations/:locationId', cors(corsOptions), (req, res) => {
    reply(act({role: 'location', resource:'location', cmd: req.method}, plain(req)), res);
  });

  // app.post('/api/stores',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'stores-management', cmd: 'create', store: req.body}), res);
  //     });
  //
  // //TODO request authentication token to provide access only to current user stores
  // app.get('/api/stores',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'stores-management', cmd: 'list'}), res);
  //     });
  //
  // app.put('/api/stores/:id?',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'stores-management', cmd: 'update'}, plain(req)), res);
  //     });
//
  // app.get('/api/stores/:id',
  //     cors(corsOptions), (req, res) => {
  //       act({role: 'stores-management', cmd: 'info', id: req.params.id})
  //           .then(info => {
  //             act({role: 'warehouse', cmd: 'stock', type: "store", store: req.params.id})
  //                 .then(stock => {
  //                   const store = Object.assign({}, info, {content: stock});
  //                   res.json({result: store});
  //                 })
  //                 .catch(err => {
  //                   res.json({err: err});
  //                 });
  //           })
  //           .catch(err => {
  //             res.json({err: err});
  //           });
  //     });
  // app.get('/api/stores/:id/info',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'stores-management', cmd: 'info', id: req.params.id}), res);
  //     });
  //
  // app.get('/api/stores/:id/stock',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'warehouse', cmd: 'stock', type: "store", store: req.params.id}), res);
  //     });
  //
  // //TODO request authentication token to provide access only to current user stock
  // app.get('/api/stock',
  //     cors(corsOptions), (req, res) => {
  //       reply(act({role: 'warehouse', cmd: 'stock'}, plain(req)), res);
  //     });
  //
  // app.delete('/api/stores/:id?', (req, res) => {
  //   reply(act({role: 'stores-management', cmd: 'delete'}, plain(req)), res);
  // });
  //
  // app.delete('/api/stores/:store/stock/:id', (req, res) => {
  //   reply(act({role: 'warehouse', cmd: 'delete'}, plain(req)), res);
  // });

};
