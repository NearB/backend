'use strict';

const seneca = require('seneca')();
const mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

const Store = require('./models').Store;

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

seneca.add({role: 'stores', cmd: 'create'}, (args, cb) => {
  const newStore = args.store;
  new Store(newStore)
      .save()
      .then(saved => {
        newStore._id = saved.id;
        cb(null, newStore);
      })
      .catch(cb);
});

// Query

seneca.add({role: 'stores', cmd: 'find'}, (args, cb) => {
  execute(Store.find(args.where, args.select), cb);
});

seneca.add({role: 'stores', cmd: 'find', type: 'one'}, (args, cb) => {
  execute(Store.findOne(args.where, args.select, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'find', type: 'id'}, (args, cb) => {
  execute(Store.findById(args.id, args.select, args.ops), cb);
});


// Remove

seneca.add({role: 'stores', cmd: 'remove', type: 'id'}, (args, cb) => {
  execute(Store.findByIdAndRemove(args.id, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'remove', type: 'one'}, (args, cb) => {
  execute(Store.findOneAndRemove(args.where, args.ops), cb);
});


// Update

seneca.add({role: 'stores', cmd: 'update', type: 'id'}, (args, cb) => {
  execute(Store.findByIdAndUpdate(args.id, args.doc, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'update', type: 'one'}, (args, cb) => {
  execute(Store.findOneAndUpdate(args.where, args.doc, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'update', type: 'bulk'}, (args, cb) => {
  execute(Store.find(args.where))
      .then(oldDocs => {
        execute(Store.update(args.where, args.doc, args.ops))
            .then((result) => {
              cb(null, {
                updateResult: result,
                modified: oldDocs
              })
            })
            .catch(cb);
      })
      .catch(cb);
});


seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

// Bootstrap some random stores
mongoose.connection.once('open', function () {
  var stores = [
    {
      name: 'Starbucks',
      owner: 'Wealthy Man',
      location: {
        address:'Corrientes y 25 of May'
      }
    },
    {
      name: 'Güll',
      owner: 'StarWars Fan',
      location: {
        address:'Cabrera 5502'
      }
    },
    {
      name: 'Barbas',
      owner: 'MMAGuy',
      location: {
        address:'Humboldt 1879'
      }
    },
    {
      name: 'PH\'s',
      owner: 'ThePampa',
      location: {
        address:'Corrientes y B.Mitre'
      }
    }
  ];

  Store.count()
      .then(function (count) {
        if (!count) return Store.create(stores);
      })
      .then(function () {
        console.log('Stores Online');
      })
      .catch(function (err) {
        console.log(err);
      });
});

module.exports.seneca = seneca;
