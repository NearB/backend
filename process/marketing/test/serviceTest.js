'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3012;


var test = require('tape');
var seneca = require('../service').seneca;

const firstAd = {
  _id: '5dadbca53cbfa3d781b13aa4',
  name: 'Geniol',
  img:'https://upload.wikimedia.org/wikipedia/en/9/93/Achille-mauzan-geniol.jpg',
  tags:['headache', 'pain'],
  expiration: '1995-12-17T03:24:00'
};

const secondAd = {
  _id: '5dadbca53cbfa3b13aa4d781',
  name: 'Quilmes Mundial',
  img:'http://img.ar.class.posot.com/es_ar/2015/07/28/Muecos-Cabezones-Seleccion-Argentina-Mundial-Francia-98-20150728124202.jpg',
  tags:['beer', 'football', 'cabezones'],
  expiration: '1998-12-17T00:00:00'
}

const campaign = {
  _id: 'a5dadbca53cbfa3d781b13a4',
  name:'Quilmes World Cup',
  tags:['France', 'WorldCup', 'ElBati'],
  ads: [], //populated later with second ad
  expiration: '1998-12-28T00:00:00'
};


test('test GET ads - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'ads', cmd: 'GET'},
  {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});


test('test GET ads - Filtered by tags', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'ads', cmd: 'GET'},
  {
    tags: 'headache,football'
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(
      result.where, {
        tags: {"$all": ['headache', 'football']}
      } ,"provided tag filters");
    t.false(result.select, "no projection provided");
  });
});


test('test POST Ad', (t) => {
  t.plan(4);

  seneca.act({role: 'marketing', resource:'ads', cmd: 'POST'},
  {
    body: firstAd
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.ad, firstAd, "mapped ad");
  });

  seneca.act({role: 'marketing', resource:'ads', cmd: 'POST'},
  {
    body: firstAd
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.ad, firstAd, "mapped ad");
  });
});


test('test DELETE ad', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'ad', cmd: 'DELETE'},
  {
    adId: firstAd._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, firstAd._id, "mapped id");
    t.false(result.ops, "no options");
  });
});


test('test POST campaign', (t) => {
  t.plan(2);

  seneca.act({role: 'marketing', resource:'campaigns', cmd: 'POST'},
  {
    body: campaign
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.campaign, campaign, "mapped campaign");
  });
});


test('test GET campaigns - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'campaigns', cmd: 'GET'},
  {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});


test('test GET campaigns - Filtered by tags', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'campaigns', cmd: 'GET'},
  {
    tags: 'France,WorldCup'
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(
      result.where, {
        tags: {"$all": ['France', 'WorldCup']}
      } ,"provided tag filters");
    t.false(result.select, "no projection provided");
  });
});


test('test GET campaign by id', (t) => {
  t.plan(4);

  seneca.act({role: 'marketing', resource:'campaign', cmd: 'GET'},
  {
    campaignId: campaign._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, campaign._id, "mapped id");
    t.false(result.select, "no select");
    t.false(result.ops, "no options");
  });
});


test('test PUT campaign', (t) => {
  t.plan(4);

  //Update campaign info
  campaign.tags = campaign.tags.concat(['light']);
  const partial = {
    tags: campaign.tags
  };

  seneca.act({role: 'marketing', resource:'campaign', cmd: 'PUT'},
  {
    campaignId: campaign._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, campaign._id, "mapped id");
    t.looseEquals(result.doc, partial, "partial as doc");
    t.false(result.ops, "no options");
  });
});


test('test DELETE campaign', (t) => {
  t.plan(3);

  seneca.act({role: 'marketing', resource:'campaign', cmd: 'DELETE'},
  {
    campaignId: campaign._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, campaign._id, "mapped id");
    t.false(result.ops, "no options");
  });
});



test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
