'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3001;
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;


const firstAd = {
  name: 'Geniol',
  img:'https://upload.wikimedia.org/wikipedia/en/9/93/Achille-mauzan-geniol.jpg',
  tags:['headache', 'pain'],
  expiration: '1995-12-17T03:24:00'
};

const secondAd = {
  name: 'Quilmes Mundial',
  img:'http://img.ar.class.posot.com/es_ar/2015/07/28/Muecos-Cabezones-Seleccion-Argentina-Mundial-Francia-98-20150728124202.jpg',
  tags:['beer', 'football', 'cabezones'],
  expiration: '1998-12-17T00:00:00'
}

const campaign = {
  name:'Quilmes World Cup',
  tags:['France', 'WorldCup', 'ElBati'],
  ads: [], //populated later with second ad
  expiration: '1998-12-28T00:00:00'
};

//=========== TESTS ARE SECUENTIAL, KEEP THAT IN MIND ===========

// ========== Ads ==========

test('test ads create', (t) => {
  t.plan(6);

  seneca.act({role: 'ads', cmd: 'create'},
  {
    ad: firstAd
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.name, firstAd.name, "same ad");
    t.ok(result._id, "added id");
    //Hackish
    firstAd._id = result._id;
  });

  seneca.act({role: 'ads', cmd: 'create'},
  {
    ad: secondAd
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.name, secondAd.name, "same ad");
    t.ok(result._id, "added id");
    //Hackish
    secondAd._id = result._id;
  });
});

test('test ads read all', (t) => {
  t.plan(4);
  seneca.act({role: 'ads', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "only created store found");

    result.forEach((element, index, array) => {
      if (element._id.toString() == firstAd._id.toString()){
        t.looseEquals(element, firstAd, "first included");
      } else if (element._id.toString() == secondAd._id.toString()){
          t.looseEquals(element, secondAd, "second included");
      } else {
        throw new Error("Invalid Product");
      }
    });
  });
});

test('test ads read by id', (t) => {
  t.plan(6);

  seneca.act({role: 'ads', cmd: 'read', type:'id'},
  {
    id: firstAd._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "ad found");
    t.looseEquals(result, firstAd, "same ad");
  });

  seneca.act({role: 'ads', cmd: 'read', type:'id'},
  {
    id: secondAd._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "ad found");
    t.looseEquals(result, secondAd, "same ad");
  });
});

test('test ads update by id', (t) => {
  t.plan(4);

  //Update secondAd info
  secondAd.expiration = '2005-12-17T03:24:00';
  const partial = {
    expiration: secondAd.expiration
  };

  //Update in the DB
  seneca.act({role: 'ads', cmd: 'update', type:'id'},
  {
    id: secondAd._id,
    doc: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, secondAd, "Returned modified ad after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'ads', cmd: 'read', type:'id'},
    {
      id: secondAd._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.looseEquals(result, secondAd, "Updated ad matched");
    });
  });
});

test('test ads delete by id', (t) => {
  t.plan(2);

  seneca.act({role: 'ads', cmd: 'delete', type:'id'},
  {
    id: firstAd._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, firstAd, "same ad");
  });
});

test('test ads read after delete', (t) => {
  t.plan(2);

  seneca.act({role: 'ads', cmd: 'read', type:'id'},
  {
    id: secondAd._id
  },
  (err, result) => {
    t.notOk(err, "no errors");
    t.looseEquals(result, secondAd, "second Ad remains");
  });
});


// ========== Campaigns ===========

test('test campaign create', (t) => {
  t.plan(3);
  seneca.act({role: 'ads', cmd: 'read'}, {},
  (err, result) => {
    campaign.ads = result.map(e => e._id.toString());

    seneca.act({role: 'campaigns', cmd: 'create'}, {campaign: campaign},
    (err, result) => {
      t.equal(err, null, "no errors");
      t.equal(result.name, campaign.name, "same campaign");
      t.ok(result._id, "added id");
      //Hackish
      campaign._id = result._id;
    });
  });

});

test('test campaigns read all', (t) => {
  t.plan(3);
  seneca.act({role: 'campaigns', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 1, "only created campaign found");
    t.looseEquals(result[0], campaign, "campaign included");
  });
});

test('test campaign read by id', (t) => {
  t.plan(3);

  seneca.act({role: 'campaigns', cmd: 'read', type:'id'},
  {
    id: campaign._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "campaign found");
    t.looseEquals(result, campaign, "same campaign");
  });
});

test('test campaign update by id', (t) => {
  t.plan(4);

  //Update cart info
  campaign.ads = [secondAd._id.toString()]
  const partial = {
    ads: campaign.ads
  };

  //Update in the DB
  seneca.act({role: 'campaigns', cmd: 'update', type:'id'},
  {
    id: campaign._id,
    doc: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, campaign, "Returned modified campaign after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'campaigns', cmd: 'read', type:'id'},
    {
      id: campaign._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.looseEquals(result, campaign, "Updated campaign matched");
    });
  });
});

test('test campaigns delete by id', (t) => {
  t.plan(4);

  seneca.act({role: 'campaigns', cmd: 'delete', type:'id'},
  {
    id: campaign._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, campaign, "same campaign");

    seneca.act({role: 'campaigns', cmd: 'read'},{},
    (err, result) => {
      t.notOk(err, "no errors");
      t.same(result.length, 0, "no campaigns");
    });
  });
});


test('shutdown', (t) => {
  t.plan(1);
  t.equal(1, 1, "Tests Completed");
  setTimeout(function() { process.exit(0); }, 100);
});
