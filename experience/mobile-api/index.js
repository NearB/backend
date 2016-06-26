'use strict';

var app = require('express')();
var morgan = require('morgan');
var services = require('./services');

app.use(morgan('combined'));

services(app);

app.listen({
  port: Number(process.env.SERVICE_PORT),
  host: process.env.SERVICE_HOST
}, function() {
  console.log('listening on port: ' + process.env.SERVICE_PORT);
});
