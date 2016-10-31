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

//REVIEW if necessary
// seneca.add({role: 'users', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Users.User.findOne(args.where, args.select, args.ops), cb);
// });


// =============== delete ===============

seneca.add({role: 'users', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Users.User.findByIdAndRemove(args.id, args.ops), cb);
});

//REVIEW if necessary
// seneca.add({role: 'users', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Users.User.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'users', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Users.User.findByIdAndUpdate(args.id, args.doc, options), cb);
});

//REVIEW if necessary
// seneca.add({role: 'users', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Users.User.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'users', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Users.User.find(args.where))
//       .then(oldDocs => {
//         execute(Users.User.update(args.where, args.doc, args.ops))
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

  var data = [
    {
      username: 'user01',
      name: '01 user',
      stores: ['00001'],
      filters: [],
      fbId: ''
    },
    {
      username: 'user02',
      name: '02 user',
      stores: ['00002'],
      filters: [],
      fbId: ''
    },
    {
      username: 'user03',
      name: '03 user',
      stores: ['00003'],
      filters: ['tag01', 'tag02', 'tag03'],
      fbId: ''
    },
    {
      username: 'user04',
      name: '04 user',
      stores: ['00004'],
      filters: [],
      fbId: ''
    },
    {
      username: 'user05',
      name: '05 user',
      stores: ['tag01'],
      filters: ['ad01', 'ad02', 'ad03'],
      fbId: ''
    },
    {
      username: 'user06',
      name: '06 user',
      stores: [],
      filters: ['tag01', 'tag02', 'tag03'],
      fbId: ''
    },
    {
      username: 'user07',
      name: '07 user',
      stores: [],
      filters: ['tag04', 'tag05', 'tag06'],
      fbId: ''
    }
  ];

  Users.User.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Users.User.create(data);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Users Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });

});


module.exports.seneca = seneca;
