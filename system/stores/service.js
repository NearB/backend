'use strict';

const seneca = require('seneca')();
const mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

const Stores = require('./models').Stores;

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

// =============== create ===============

seneca.add({role: 'stores', cmd: 'create'}, (args, cb) => {
  const newStore = args.store;
  new Stores.Store(newStore)
      .save()
      .then(saved => {
        newStore._id = saved._id;
        cb(null, newStore);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'stores', cmd: 'read'}, (args, cb) => {
  execute(Stores.Store.find(args.where, args.select), cb);
});

seneca.add({role: 'stores', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Stores.Store.findById(args.id, args.select, args.ops), cb);
});

// seneca.add({role: 'stores', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Stores.Store.findOne(args.where, args.select, args.ops), cb);
// });


// =============== delete ===============

seneca.add({role: 'stores', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Stores.Store.findByIdAndRemove(args.id, args.ops), cb);
});

// seneca.add({role: 'stores', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Stores.Store.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'stores', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Stores.Store.findByIdAndUpdate(args.id, args.doc, options), cb);
});

// seneca.add({role: 'stores', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Stores.Store.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'stores', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Stores.Store.find(args.where))
//       .then(oldDocs => {
//         execute(Stores.Store.update(args.where, args.doc, args.ops))
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

// Bootstrap some random stores
mongoose.connection.once('open', function () {
  var stores = [
    {
      name: 'Barbas',
      ownerId: '581673454902593b55ac37e4',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 10}
      ],
      locations: ['73454902593b55ac358167e4', '7324516490593b55ac37e458'],
      adTags: ['happyHour'],
      campaignTags: ['firstSixDiscount']
    },
    {
      name: 'OnTap',
      ownerId: '54902593b55ac37e45816734',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 109}
      ],
      locations: ['735845164902593b55ac37e4'],
      adTags: ['happyHour'],
      campaignTags: []
    },
    {
      name: 'Cervelar',
      ownerId: '581673493b55ac37e4549025',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 1}
      ],
      locations: ['73454902593b55ac37e45816', '6490259734513b55ac37e458'],
      adTags: [],
      campaignTags: []
    },
    {
      name: 'DBox',
      ownerId: '816734549502593b55ac37e4',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 0}
      ],
      locations: ['73454902593b55ac37e45816', '7345164902593b55ac37e458', '745164902593b55ac37e4358'],
      adTags: ['happyHour', 'allHalfPrice'],
      campaignTags: []
    },
    {
      name: 'La Birreria',
      ownerId: '58167342593b55ac37e45490',
      stock: [
        {productId: '5ac37e4454902595816733b5', price: 75, stock: 100},
        {productId: '816735ac37e44549025953b5', price: 75, stock: 90}
      ],
      locations: ['737e45816454902593b55ac3'],
      adTags: ['birthDay', 'beerWithBurguer'],
      campaignTags: ['openingMonth', 'largeGroups']
    }
  ];

  Stores.Store.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Stores.Store.create(stores);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Stores Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
});

module.exports.seneca = seneca;
