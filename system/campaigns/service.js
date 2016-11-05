'use strict';

const seneca = require('seneca')();
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
  execute(Marketing.Campaign.find(args.where, args.select), cb);
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
  const options = Object.assign({}, {new: true}, args.ops)
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

// seneca.add({role: 'ads', cmd: 'read', type: 'id'}, (args, cb) => {
//   execute(Marketing.Ad.findById(args.id, args.select, args.ops), cb);
// });

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


// Bootstrap some random products
mongoose.connection.once('open', function () {

  var adsData = [
    {
      id: 'ad01',
      name: '01 Ad',
      tags: ['tag01'],
      img: "/some/path"
    },
    {
      id: 'ad02',
      name: '02 Ad',
      tags: [],
      img: "/some/path"
    },
    {
      id: 'ad03',
      name: '03 Ad',
      tags: ['tag01', 'tag02'],
      img: "/some/path"
    },
    {
      id: 'ad04',
      name: '04 Ad',
      tags: ['tag01', 'tag02'],
      img: "/some/path"
    },
    {
      id: 'ad05',
      name: '05 Ad',
      tags: ['tag03'],
      img: "/some/path"
    },
    {
      id: 'ad06',
      name: '06 Ad',
      tags: [],
      img: "/some/path",
      expiration: "20161212"
    }
  ];

  var campaignData = [
    {
      id: 'campaign01',
      name: '01 campaign',
      tags: ['tag01'],
      ads: ['ad01', 'ad02', 'ad03']
    },
    {
      id: 'campaign02',
      name: '02 campaign',
      tags: [],
      ads: ['ad01', 'ad02', 'ad03']
    },
    {
      id: 'campaign03',
      name: '03 campaign',
      tags: ['tag01', 'tag02'],
      ads: ['ad01', 'ad02', 'ad03']
    },
    {
      id: 'campaign04',
      name: '04 campaign',
      tags: ['tag01', 'tag02'],
      ads: ['ad03']
    },
    {
      id: 'campaign05',
      name: '05 campaign',
      tags: ['tag03'],
      ads: ['ad05', 'ad04', 'ad06']
    },
    {
      id: 'campaign06',
      name: '06 campaign',
      tags: [],
      ads: ['ad06', 'ad05']
    }
  ];

  Marketing.Campaign.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Marketing.Campaign.create(campaignData);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Campaigns Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });

  Marketing.Ad.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Marketing.Ad.create(adsData);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Ads Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
});

module.exports.seneca = seneca;
