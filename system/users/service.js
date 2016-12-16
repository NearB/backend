'use strict';

const seneca = require('seneca')();
const mongoose = require('./mongoose');

mongoose.Promise = require('bluebird');

const Users = require('./models').Users;

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

// =============== Users ===============
// =============== create ===============

seneca.add({role: 'users', cmd: 'create'}, (args, cb) => {
  const newUser = args.user;
  console.log(newUser);
  new Users.User(newUser)
      .save()
      .then(saved => {
        newUser._id = saved._id;
        //Doing this to replicate the '(-__v) + toObject'
        cb(null, newUser);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'users', cmd: 'read'}, (args, cb) => {
  execute(Users.User.find(args.where, args.select), cb);
});

seneca.add({role: 'users', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Users.User.findById(args.id, args.select, args.ops), cb);
});

seneca.add({role: 'users', cmd: 'read', type: 'one'}, (args, cb) => {
  execute(Users.User.findOne(args.where, args.select, args.ops), cb);
});


// =============== delete ===============

seneca.add({role: 'users', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Users.User.findByIdAndRemove(args.id, args.ops), cb);
});

// =============== update ===============

seneca.add({role: 'users', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Users.User.findByIdAndUpdate(args.id, args.doc, options), cb);
});

mongoose.connection.once('open', function () {

  // Users.User.remove({}, function(err) {
  //    console.log('collection removed');
  //   //  Users.User.count()
  //   //      .then(function (count) {
  //   //        if (!count && !process.env.TESTING){
  //   //          return Users.User.create(data);
  //   //        }
  //   //      })
  //   //      .then(function () {
  //   //        if (!process.env.TESTING){
  //   //          console.log('Users Online');
  //   //        }
  //   //      })
  //   //      .catch(function (err) {
  //   //        console.log(err);
  //   //      });
  // });

});

seneca.listen({host: process.env.SERVICE_HOST, port: process.env.SERVICE_PORT});

module.exports.seneca = seneca;
