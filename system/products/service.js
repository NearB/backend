'use strict';

const seneca = require('seneca')();
const mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

const Products = require('./models').Products;
/*
  Product:Product,
  CartProduct:CartProduct,
  Cart:Cart
*/

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

// =============== Product ===============
// =============== create ===============

seneca.add({role: 'products', cmd: 'create'}, (args, cb) => {
  const newProduct = args.product;
  new Products.Product(newProduct)
      .save()
      .then(saved => {
        newProduct._id = saved._id;
        //Doing this to replicate the '(-__v) + toObject'
        cb(null, newProduct);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'products', cmd: 'read'}, (args, cb) => {
  execute(Products.Product.find(args.where, args.select), cb);
});

seneca.add({role: 'products', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Products.Product.findById(args.id, args.select, args.ops), cb);
});

// seneca.add({role: 'products', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Products.Product.findOne(args.where, args.select, args.ops), cb);
// });


// =============== delete ===============

seneca.add({role: 'products', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Products.Product.findByIdAndRemove(args.id, args.ops), cb);
});

// seneca.add({role: 'products', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Products.Product.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'products', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Products.Product.findByIdAndUpdate(args.id, args.doc, options), cb);
});

// seneca.add({role: 'products', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Products.Product.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'products', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Products.Product.find(args.where))
//       .then(oldDocs => {
//         execute(Products.Product.update(args.where, args.doc, args.ops))
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

// REVIEW high level endpoints make sense but probably not neccesary to have this as entities
// // =============== CartProduct ===============
// // =============== create ===============
//
// seneca.add({role: 'cartProduct', cmd: 'create'}, (args, cb) => {
//   const newCartProduct = args.cartProduct;
//   new Products.CartProduct(newCartProduct)
//       .save()
//       .then(saved => {
//         newCartProduct._id = saved._id;
//         //Doing this to replicate the '(-__v) + toObject'
//         cb(null, newCartProduct);
//       })
//       .catch(cb);
// });
//
// // =============== read ===============
//
// seneca.add({role: 'cartProduct', cmd: 'read'}, (args, cb) => {
//   execute(Products.CartProduct.find(args.where, args.select), cb);
// });
//
// seneca.add({role: 'cartProduct', cmd: 'read', type: 'id'}, (args, cb) => {
//   execute(Products.CartProduct.findById(args.id, args.select, args.ops), cb);
// });
//
// // seneca.add({role: 'cartProduct', cmd: 'read', type: 'one'}, (args, cb) => {
// //   execute(Products.CartProduct.findOne(args.where, args.select, args.ops), cb);
// // });
//
// // =============== delete ===============
//
// seneca.add({role: 'cartProduct', cmd: 'delete', type: 'id'}, (args, cb) => {
//   execute(Products.CartProduct.findByIdAndRemove(args.id, args.ops), cb);
// });
//
// // seneca.add({role: 'cartProduct', cmd: 'delete', type: 'one'}, (args, cb) => {
// //   execute(Products.CartProduct.findOneAndRemove(args.where, args.ops), cb);
// // });
//
//
// // =============== update ===============
//
// seneca.add({role: 'cartProduct', cmd: 'update', type: 'id'}, (args, cb) => {
//   const upsertOptions = Object.assign({upsert: true}, args.ops);
//   execute(Products.CartProduct.findByIdAndUpdate(args.id, args.doc, upsertOptions), cb);
// });
//
// //REVIEW is neccesary
// // seneca.add({role: 'cartProduct', cmd: 'update', type: 'one'}, (args, cb) => {
// //   execute(Products.CartProduct.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// // });
// //
// // seneca.add({role: 'cartProduct', cmd: 'update', type: 'bulk'}, (args, cb) => {
// //   execute(Products.CartProduct.find(args.where))
// //       .then(oldDocs => {
// //         execute(Products.CartProduct.update(args.where, args.doc, args.ops))
// //             .then((result) => {
// //               cb(null, {
// //                 updateResult: result,
// //                 modified: oldDocs
// //               })
// //             })
// //             .catch(cb);
// //       })
// //       .catch(cb);
// // });

// =============== Cart ===============
// =============== create ===============

seneca.add({role: 'cart', cmd: 'create'}, (args, cb) => {
  const newCart = args.cart;
  new Products.Cart(newCart)
      .save()
      .then(saved => {
        newCart._id = saved._id;
        cb(null, newCart);
      })
      .catch(cb);
});

// =============== read ===============

seneca.add({role: 'cart', cmd: 'read'}, (args, cb) => {
  execute(Products.Cart.find(args.where, args.select), cb);
});

seneca.add({role: 'cart', cmd: 'read', type: 'id'}, (args, cb) => {
  execute(Products.Cart.findById(args.id, args.select, args.ops), cb);
});

// seneca.add({role: 'cart', cmd: 'read', type: 'one'}, (args, cb) => {
//   execute(Products.Cart.findOne(args.where, args.select, args.ops), cb);
// });


// =============== delete ===============

seneca.add({role: 'cart', cmd: 'delete', type: 'id'}, (args, cb) => {
  execute(Products.Cart.findByIdAndRemove(args.id, args.ops), cb);
});

// seneca.add({role: 'cart', cmd: 'delete', type: 'one'}, (args, cb) => {
//   execute(Products.Cart.findOneAndRemove(args.where, args.ops), cb);
// });


// =============== update ===============

seneca.add({role: 'cart', cmd: 'update', type: 'id'}, (args, cb) => {
  const options = Object.assign({}, {new: true}, args.ops)
  execute(Products.Cart.findByIdAndUpdate(args.id, args.doc, options), cb);
});

//REVIEW is neccesary
// seneca.add({role: 'cart', cmd: 'update', type: 'one'}, (args, cb) => {
//   execute(Products.Cart.findOneAndUpdate(args.where, args.doc, args.ops), cb);
// });
//
// seneca.add({role: 'cart', cmd: 'update', type: 'bulk'}, (args, cb) => {
//   execute(Products.Cart.find(args.where))
//       .then(oldDocs => {
//         execute(Products.Cart.update(args.where, args.doc, args.ops))
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


// Bootstrap some random products
mongoose.connection.once('open', function () {
  var products = [
    {
      name: 'Belgian Pale Ale',
      tags: ['beer', 'blonde'],
      img: 'http://blog.twobeerdudes.com/wp-content/uploads/2012/08/brett_backspin_belgian_pale_ale.jpg',
      description: 'abv: 4.0-7.0%, delicate hop finish, sweetish to toasty malt overtones'
    },
    {
      name: 'Coffee Stout',
      tags: ['beer', 'stout'],
      img: 'https://s3.amazonaws.com/brewerydbapi/beer/onGh9g/upload_VuPXQJ-medium.png',
      description: 'ABV: 5.7%, IBU: 30, Pale, Caramel, Roasted Barley, Oats'
    }];

  Products.Product.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Products.Product.create(products);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Products Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });

  var cart = {
    total: 20,
    products: [
      {
        productId: '58169988e7be135e5369225c',
        quantity: 20,
        price: 1
      }
    ],
    discount: 0
  };

  Products.Cart.count()
      .then(function (count) {
        if (!count && !process.env.TESTING){
          return Products.Cart.create(cart);
        }
      })
      .then(function () {
        if (!process.env.TESTING){
          console.log('Cart Online');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
});


module.exports.seneca = seneca;
