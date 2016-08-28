'use strict';

var app = require('express')();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var services = require('./services');

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('json spaces', 2);

services(app);

app.listen({
    port: Number(process.env.SERVICE_PORT),
    host: process.env.SERVICE_HOST
  },
  function () {
    console.log('listening on port: ' + process.env.SERVICE_PORT);
  });

