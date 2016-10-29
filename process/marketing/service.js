'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

// System APIs
seneca.client({
  host: process.env.PROXY_HOST,
  port: process.env.campaigns_PORT,
  pin: {role: 'campaigns'}
});

// =============== marketing/ads ===============
seneca.add({role: 'marketing', resource:'ads', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'ads', cmd: 'POST'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/ads/:adId ===============
seneca.add({role: 'marketing', resource:'ad', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/campaigns ===============
seneca.add({role: 'marketing', resource:'campaigns', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaigns', cmd: 'POST'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/campaigns/:campaignId ===============
seneca.add({role: 'marketing', resource:'campaign', cmd: 'GET'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaign', cmd: 'PUT'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaign', cmd: 'DELETE'}, (args, callback) => {

  act({role: 'content', cmd: 'add'}, args)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
