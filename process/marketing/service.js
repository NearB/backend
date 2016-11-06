'use strict';

const Promise = require('bluebird');
const seneca = require('seneca')();

const act = Promise.promisify(seneca.act, {context: seneca});

if (process.env.TESTING){
  require('seneca-stub')(seneca);
  seneca.stub('role:campaigns', (args, cb) => {
    cb(null, args)
  });
  seneca.stub('role:ads', (args, cb) => {
    cb(null, args)
  });
} else {
  // System APIs
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.campaigns_PORT,
    pin: {role: 'campaigns'}
  });
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.campaigns_PORT,
    pin: {role: 'ads'}
  });
}


// =============== marketing/ads ===============
// =============== ?tags=tag01,tag02 ===============
seneca.add({role: 'marketing', resource:'ads', cmd: 'GET'}, (args, callback) => {

  const params = {};
  if (args.tags){
    params.where = {tags: {"$all": args.tags.split(",")}};
  }

  act({role: 'ads', cmd: 'read'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/ads/:adId ===============
seneca.add({role: 'marketing', resource:'ad', cmd: 'GET'}, (args, callback) => {

  if (!args.adId){
    callback("Missing adId");
  }

  const params = {
    id: args.adId
  }
  act({role: 'ads', cmd: 'read', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'ads', cmd: 'POST'}, (args, callback) => {

  if (!args.body){
    callback("Missing ad data in body");
  }

  const params = {
    ad: args.body
  }

  act({role: 'ads', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/ads/:adId ===============
seneca.add({role: 'marketing', resource:'ad', cmd: 'DELETE'}, (args, callback) => {

  if (!args.adId){
    callback("Missing ad id in url")
  }

  const params = {
    id: args.adId
  }

  act({role: 'ads', cmd: 'delete', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/campaigns ===============
// =============== ?tags=tag01,tag02 ===============
seneca.add({role: 'marketing', resource:'campaigns', cmd: 'GET'}, (args, callback) => {

  const params = {};
  if (args.tags){
    params.where = {tags: {"$all": args.tags.split(",")}};
  }

  act({role: 'campaigns', cmd: 'read'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaigns', cmd: 'POST'}, (args, callback) => {
  if (!args.body){
    callback("Missing campaign data in body")
  }

  const params = {
    campaign: args.body
  }

  act({role: 'campaigns', cmd: 'create'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

// =============== marketing/campaigns/:campaignId ===============
seneca.add({role: 'marketing', resource:'campaign', cmd: 'GET'}, (args, callback) => {

  if (!args.campaignId){
    callback("Missing campaignId id in url")
  }

  const params = {
    id: args.campaignId
  }

  act({role: 'campaigns', cmd: 'read', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaign', cmd: 'PUT'}, (args, callback) => {

  if (!args.body){
    callback("Missing campaign data in body")
  }

  if (!args.campaignId){
    callback("Missing campaignId")
  }

  const params = {
    id: args.campaignId,
    doc: args.body
  }

  act({role: 'campaigns', cmd: 'update', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.add({role: 'marketing', resource:'campaign', cmd: 'DELETE'}, (args, callback) => {

  if (!args.campaignId){
    callback("Missing campaignId")
  }

  const params = {
    id: args.campaignId
  }

  act({role: 'campaigns', cmd: 'delete', type:'id'}, params)
      .then(result => {
        callback(null, result);
      })
      .catch(callback);
});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
