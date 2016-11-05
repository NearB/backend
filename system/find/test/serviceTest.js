'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3111;
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;


// const Location = {
//   name:'Starbucks01',
//   coordinates:{ type: String, required:[true, 'Missing required field [  coordinates]']},
//   fingerprint:{ type: [Fingerprint], required:[true, 'Missing required field [  fingerprint]']},
//   address: String
// };

const firstFP = {
  mac: 'ee:94:f6:c4:14:b1',
  rssi: -44
};

const secondFP = {
  mac: '74:94:f6:c4:14:b6',
  rssi: -80
};

const trackingInformation = {
  group: 'NearB',
  username: 'testUser',
  location: 'Starbucks01',
  time: '1478379117',
  'wifi-fingerprint': [firstFP, secondFP]
};

test('test list locations', (t) => {
  t.plan(4);

  const groupName = 'NearB';
  seneca.act({role: 'find', cmd: 'list'},
  {
    group: groupName
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.message.includes(groupName), 'valid message');
    t.ok(result.users, 'containing users');
    t.equal(result.users.alem.length, 1, 'which contain locations');
  });
});


test('test server status', (t) => {
  t.plan(3);

  seneca.act({role: 'find', cmd: 'status'},{},
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.registered);
    t.ok(result.status);
  });
});

test('test learn location', (t) => {
  t.plan(3);

  seneca.act({role: 'find', cmd: 'learn'},
  {
    trackingInfo: trackingInformation
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.message.includes(trackingInformation['wifi-fingerprint']), 'valid fingerprints');
    t.ok(result.message.includes(trackingInformation.username), 'valid username');
  });
});

test('test track location', (t) => {
  t.plan(3);

  seneca.act({role: 'find', cmd: 'locate'},
  {
    trackingInfo: trackingInformation
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.message.includes(trackingInformation.username), 'valid username');
    t.equal(result.location, trackingInformation.location, 'valid location');
  });
});

test('test delete location', (t) => {
  t.plan(3);

  seneca.act({role: 'find', cmd: 'delete', type: 'location'},
  {
    group: trackingInformation.group,
    location: trackingInformation.location
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.message.includes(trackingInformation.group), 'valid groupName');
    t.ok(result.message.includes(trackingInformation.location), 'valid location');
  });
});

test('test delete username', (t) => {
  t.plan(3);

  seneca.act({role: 'find', cmd: 'delete', type: 'user'},
  {
    group: trackingInformation.group,
    username: trackingInformation.username
  },
  (err, result) => {
    t.equal(err, null, 'no errors');
    t.ok(result.message.includes(trackingInformation.group), 'valid groupName');
    t.ok(result.message.includes(trackingInformation.username), 'valid username');
  });
});


test('shutdown', (t) => {
  t.plan(1);
  t.equal(1, 1, 'Tests Completed');
  setTimeout(function() { process.exit(0); }, 100);
});
