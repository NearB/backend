'use strict';

var Find = require('./models/Find.js');
var seneca = require('seneca')();

const client = new Find();

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

seneca.add({role: 'find', cmd: 'status'}, (args, callback) => {

  client.status()
    .then(res => {
      console.log(res);

      callback(null, res);
    })
    .catch(err => {
      console.log(err);
    });
});

seneca.add({role: 'find', cmd: 'learn'}, (args, callback) => {

  client.learn(args.ap)
    .then(res => {
      console.log(res);

      callback(null, res);
    })
    .catch(err => {
      console.log(err);
    });
});


module.exports.seneca = seneca;
