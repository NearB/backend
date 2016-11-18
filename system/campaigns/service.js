'use strict';

const seneca = require('seneca')();
const _ = require('lodash');
const mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

const Marketing = require('./models').Marketing;

const successCb = (cb) => {
  return res => {
    return cb.call(this, null, res);
  }
};

const execute = (query, cb) => {
  const promise = query.select('-__v').lean();
  if (!cb) {
    return promise;
  }
  promise
      .then(successCb(cb))
      .catch(cb);
};

// =============== Campaigns ===============
// =============== create ===============

seneca.add({role: 'campaigns', cmd: 'create'}, (args, cb) => {
  const newCampaign = args.campaign;
  new Marketing.Campaign(newCampaign)
      .save()
      .then(saved => {
        newCampaign._id = saved._id;
        //Doing this to replicate the '(-__v) + toObject'
        cb(null, newCampaign);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'campaigns', cmd: 'read'}, (args, cb) => {
  execute(Marketing.Campaign.find(args.where, args.select).populate('ads', 'name _id'), cb);
});

seneca.add({role: 'campaigns', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Marketing.Campaign.findById(args.id, args.select, args.ops), cb);
});

// seneca.add({role: 'campaigns', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Marketing.Campaign.findOne(args.where, args.select, args.ops), cb);
// });


// =============== delete ===============

seneca.add({role: 'campaigns', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Marketing.Campaign.findByIdAndRemove(args.id, args.ops), cb);
});

// seneca.add({role: 'campaigns', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Marketing.Campaign.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'campaigns', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops);
  execute(Marketing.Campaign.findByIdAndUpdate(args.id, args.doc, options), cb);
});

//REVIEW if necessary
// seneca.add({role: 'campaigns', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Marketing.Campaign.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'campaigns', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Marketing.Campaign.find(args.where))
//       .then(oldDocs => {
//         execute(Marketing.Campaign.update(args.where, args.doc, args.ops))
//             .then((result) => {
//               cb(null, {
//                 updateResult: result,
//                 modified: oldDocs
//               })
//             })
//             .catch(cb);
//       })
//       .catch(cb);
// });

// =============== Ads ===============
// =============== create ===============

seneca.add({role: 'ads', cmd: 'create'}, (args, cb) => {
  const newAd = args.ad;
  new Marketing.Ad(newAd)
      .save()
      .then(saved => {
        newAd._id = saved._id;
        //Doing this to replicate the '(-__v) + toObject'
        cb(null, newAd);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'ads', cmd: 'read'}, (args, cb) => {
  execute(Marketing.Ad.find(args.where, args.select), cb);
});

seneca.add({role: 'ads', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Marketing.Ad.findById(args.id, args.select, args.ops), cb);
});

// seneca.add({role: 'ads', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Marketing.Ad.findOne(args.where, args.select, args.ops), cb);
// });

// =============== delete ===============

seneca.add({role: 'ads', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Marketing.Ad.findByIdAndRemove(args.id, args.ops), cb);
});

// seneca.add({role: 'ads', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Marketing.Ad.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'ads', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Marketing.Ad.findByIdAndUpdate(args.id, args.doc, options), cb);
});

//REVIEW if necessary
// seneca.add({role: 'ads', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Marketing.Ad.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'ads', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Marketing.Ad.find(args.where))
//       .then(oldDocs => {
//         execute(Marketing.Ad.update(args.where, args.doc, args.ops))
//             .then((result) => {
//               cb(null, {
//                 updateResult: result,
//                 modified: oldDocs
//               })
//             })
//             .catch(cb);
//       })
//       .catch(cb);
// });

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});


// Bootstrap some random campaigns / ads
mongoose.connection.once('open', function () {
  if (process.env.TESTING) return;

  var adsData = [
    {
      name: '01 Ad',
      tags: ['tag01'],
      img: "/some/path"
    },
    {
      name: '02 Ad',
      tags: ['tag01'],
      img: "/some/path"
    },
    {
      name: '03 Ad',
      tags: ['tag01', 'tag02'],
      img: "/some/path"
    },
    {
      name: '04 Ad',
      tags: ['tag01', 'tag02'],
      img: "/some/path"
    },
    {
      name: '05 Ad',
      tags: ['tag03'],
      img: "/some/path"
    },
    {
      name: '06 Ad',
      tags: ['tag01'],
      img: "/some/path",
      expiration: "20161212"
    }
  ];

  var campaignData = [
    {
      name: '01 campaign',
      tags: ['tag01'],
      ads: []
    },
    {
      name: '02 campaign',
      tags: ['tag02', 'tag04'],
      ads: []
    },
    {
      name: '03 campaign',
      tags: ['tag01', 'tag02'],
      ads: []
    },
    {
      name: '04 campaign',
      tags: ['tag01', 'tag02'],
      ads: []
    },
    {
      name: '05 campaign',
      tags: ['tag03'],
      ads: []
    },
    {
      name: '06 campaign',
      tags: ['tag06'],
      ads: []
    }
  ];

  // DROP COLLECTIONS
  // Marketing.Campaign.remove({}, function(err) {
  //    console.log('collection removed')
  // });
  // Marketing.Ad.remove({}, function(err) {
  //    console.log('collection removed')
  // });


  Marketing.Ad.count()
    .then(function (count) {
      if (!count) {
        return Marketing.Ad.create(adsData);
      }
    })
    .then(function (ads) {
      console.log('Ads Online');
      campaignData.forEach( function (campaign) {
        const adsQty = _.random(1, 3);
        for (let i = 0; i < adsQty; i++) {
          // this might add repeated ads /shrug
          campaign.ads.push(_.sample(ads));
        }
      });
      return Marketing.Campaign.count()
    })
    .then(function (count) {
      if (!count) {
        return Marketing.Campaign.create(campaignData);
      }
    })
    .then(function () {
      console.log('Campaigns Online');
    })
    .catch(function (err) {
      console.log(err);
    });
});

module.exports.seneca = seneca;
