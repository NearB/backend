'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3011;


var test = require('tape');
var seneca = require('../service').seneca;

const firstFP = {
  mac: 'ee:94:f6:c4:14:b1',
  rssi: -44
};

const secondFP = {
  mac: '74:94:f6:c4:14:b6',
  rssi: -80
};

const encondedBeacons = encodeURI(`${firstFP.mac}=${firstFP.rssi},${secondFP.mac}=${secondFP.rssi}`);

const trackingInformation = {
  group: 'NearB',
  username: 'testUser',
  location: 'Starbucks01',
  time: '1478379117',
  'wifi-fingerprint': [firstFP, secondFP]
};


test('test GET locate', (t) => {
  t.plan(6);

  seneca.act({role: 'location', resource:'locate', cmd: 'GET'},
  {
    beacons: encondedBeacons,
    username: trackingInformation.username
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result.success, "success response");
    t.ok(result.message.includes(trackingInformation.username), "correct username");
    t.equal(Object.keys(result.bayes).length, 2, "correct bayes length");
    t.ok(result.bayes[`${trackingInformation.username}:${firstFP.mac}`], 'contains location one');
    t.ok(result.bayes[`${trackingInformation.username}:${secondFP.mac}`], 'contains location two');
  });
});


test('test GET discover with beacons', (t) => {
  t.plan(3);

  const expectedFilter = {
    $in: [`${trackingInformation.username}:${firstFP.mac}`,
            `${trackingInformation.username}:${secondFP.mac}`]
  }

  seneca.act({role: 'location', resource:'discover', cmd: 'GET'},
  {
    beacons: encondedBeacons,
    username: trackingInformation.username
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.where, 'created filter');
    t.looseEquals(result.where.locations, expectedFilter, 'filter matched');
  });
});


test('test GET discover with locations', (t) => {
  t.plan(3);

  const locations = `${trackingInformation.username}:${firstFP.mac},${trackingInformation.username}:${secondFP.mac}`
  const expectedFilter = {
    $in: [`${trackingInformation.username}:${firstFP.mac}`,
            `${trackingInformation.username}:${secondFP.mac}`]
  }

  seneca.act({role: 'location', resource:'discover', cmd: 'GET'},
  {
    locations: locations,
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.where, 'created filter');
    t.looseEquals(result.where.locations, expectedFilter, 'filter matched');
  });
});


test('test GET locations list', (t) => {
  t.plan(2);

  seneca.act({role: 'location', resource:'locations', cmd: 'GET'}, {},
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.equal(result.group, 'NearB');
  });
});


test('test PUT locations', (t) => {
  t.plan(2);


  seneca.act({role: 'location', resource:'locations', cmd: 'PUT'},
  {
    body: trackingInformation
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.looseEquals(result.trackingInfo, trackingInformation);
  });
});


test('test DELETE location', (t) => {
  t.plan(2);

  seneca.act({role: 'location', resource:'location', cmd: 'DELETE'},
  {
    locationId: `${trackingInformation.username}:${firstFP.mac}`
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.equal(result.location, `${trackingInformation.username}:${firstFP.mac}`);
  });
});


test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
