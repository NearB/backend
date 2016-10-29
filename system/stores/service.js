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
        newStore._id = saved.id;
        cb(null, newStore);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'stores', cmd: 'read'}, (args, cb) => {
  execute(Stores.Store.find(args.where, args.select), cb);
});

seneca.add({role: 'stores', cmd: 'read', type: 'one'}, (args, cb) => {
  execute(Stores.Store.findOne(args.where, args.select, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Stores.Store.findById(args.id, args.select, args.ops), cb);
});


// =============== delete ===============

seneca.add({role: 'stores', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Stores.Store.findByIdAndRemove(args.id, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'delete', type: 'one'}, (args, cb) => {
  execute(Stores.Store.findOneAndRemove(args.where, args.ops), cb);
});


// =============== update ===============

seneca.add({role: 'stores', cmd: 'update', type: 'id'}, (args, cb) => {
  execute(Stores.Store.findByIdAndUpdate(args.id, args.doc, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'update', type: 'one'}, (args, cb) => {
  execute(Stores.Store.findOneAndUpdate(args.where, args.doc, args.ops), cb);
});

seneca.add({role: 'stores', cmd: 'update', type: 'bulk'}, (args, cb) => {
  execute(Stores.Store.find(args.where))
      .then(oldDocs => {
        execute(Stores.Store.update(args.where, args.doc, args.ops))
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
      id: '00001',
      name: 'Starbucks',
      owner: 'Wealthy Man',
      location: {
        address:'Corrientes y 25 of May'
      }
    },
    {
      id: '00002',
      name: 'Güll',
      owner: 'StarWars Fan',
      location: {
        address:'Cabrera 5502'
      }
    },
    {
      id: '00003',
      name: 'Barbas',
      owner: 'MMAGuy',
      location: {
        address:'Humboldt 1879'
      }
    },
    {
      id: '00004',
      name: 'PH\'s',
      owner: 'ThePampa',
      location: {
        address:'Corrientes y B.Mitre'
      }
    }
  ];

  Stores.Store.count()
      .then(function (count) {
        if (!count) return Stores.Store.create(stores);
      })
      .then(function () {
        console.log('Stores Online');
      })
      .catch(function (err) {
        console.log(err);
      });
});

module.exports.seneca = seneca;
