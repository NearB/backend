'use strict';

const seneca = require('seneca')();
const mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

const Content = require('./models').Content;

//TODO this should be a lib shared by npm
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

seneca.add({role: 'content', cmd: 'add'}, (args, cb) => {
  const newContent = args.content;
  new Content(newContent)
      .save()
      .then(saved => {
        newContent._id = saved.id;
        cb(null, newContent);
      })
      .catch(cb);
});

// Query
seneca.add({role: 'content', cmd: 'find'}, (args, cb) => {
  // this is for debugging only, no real production case would read the stock
  // of all the stores for all the owners
  execute(Content.find(), cb);
});

seneca.add({role: 'content', cmd: 'find', type: 'store'}, (args, cb) => {
  Content.find().then(console.log).catch(console.log);
  execute(Content.find({_store: args.store}, args.select), cb);
});

seneca.add({role: 'content', cmd: 'find', type: 'owner'}, (args, cb) => {
  execute(Content.find({_owner: args.owner}, args.select), cb);
});

seneca.add({role: 'content', cmd: 'find', type: 'item'}, (args, cb) => {
  execute(Content.findById(args.id, args.select, args.ops), cb);
});


// Remove
seneca.add({role: 'content', cmd: 'remove', type: 'item'}, (args, cb) => {
  execute(Content.findByIdAndRemove(args.id, args.ops), cb);
});


// Update
seneca.add({role: 'content', cmd: 'update', type: 'item'}, (args, cb) => {
  execute(Content.findByIdAndUpdate(args.id, args.doc, args.ops), cb);
});


//FIXME copy paste from Stores
seneca.add({role: 'content', cmd: 'update', type: 'bulk'}, (args, cb) => {
  execute(Content.find(args.where))
      .then(oldDocs => {
        execute(Content.update(args.where, args.doc, args.ops))
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


// Bootstrap some random content
mongoose.connection.once('open', function () {
  const stock = [];
  seneca.client({
    host: process.env.PROXY_HOST,
    port: process.env.stores_management_PORT,
    pin: {role: 'stores-management'}
  }).act({role: 'stores-management', cmd: 'list'}, (err, stores) => {
    if (err) {
      console.log(err);
      return;
    }

    stores.forEach((store) => {
      stock.push({
        name: "Indian Pale Ale",
        _store: store._id,
        _owner: store.owner,
        img: "http://img1.rnkr-static.com/node_img/13/252106/C100/scottish-courage-mcewan-s-india-pale-ale-beers-photo-1.jpg",
        description: "Bitter as fuck",
        price: 7
      })
    });

    Content.count().then((count) => {
      if (!count) {
        return Content.create(stock)
          .then(() => {
            return Content.find().select('-__v').lean();
          })
          .then((res) => {
            console.log("Content Bootstrap Ok: ", res);
          });
      }
    }).catch((err) => {
      console.log(err);
    });
  });
});

module.exports.seneca = seneca;
