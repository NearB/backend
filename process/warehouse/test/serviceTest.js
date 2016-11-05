'use strict';

process.env.TESTING = true;

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3011;


var test = require('tape');
var seneca = require('../service').seneca;

const firstProduct = {
  _id: '5dadbca53cbfa3d781b13aa4',
  name: 'Belgian Pale Ale',
  tags: ['beer', 'blonde'],
  img: 'http://blog.twobeerdudes.com/wp-content/uploads/2012/08/brett_backspin_belgian_pale_ale.jpg',
  description: 'abv: 4.0-7.0%, delicate hop finish, sweetish to toasty malt overtones'
};

const secondProduct = {
  _id: '581b13aa4dadbca53cbfa3d7',
  name: 'Coffee Stout',
  tags: ['beer', 'stout'],
  img: 'https://s3.amazonaws.com/brewerydbapi/beer/onGh9g/upload_VuPXQJ-medium.png',
  description: 'ABV: 5.7%, IBU: 30, Pale, Caramel, Roasted Barley, Oats'
};


test('test POST product', (t) => {
  t.plan(4);

  seneca.act({role: 'warehouse', resource:'products', cmd: 'POST'},
  {
    body: firstProduct
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.product, firstProduct, "mapped product");
  });

  seneca.act({role: 'warehouse', resource:'products', cmd: 'POST'},
  {
    body: secondProduct
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result.product, secondProduct, "mapped product");
  });
});


test('test GET products - No filters', (t) => {
  t.plan(3);

  seneca.act({role: 'warehouse', resource:'products', cmd: 'GET'},
  {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.false(result.where, "no filters provided");
    t.false(result.select, "no projection provided");
  });
});


test('test GET products - Filtered by tags', (t) => {
  t.plan(3);

  seneca.act({role: 'warehouse', resource:'products', cmd: 'GET'},
  {
    tags: 'beer,blonde'
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(
      result.where, {
        tags: {"$all": ['beer', 'blonde']}
      } ,"provided tag filters");
    t.false(result.select, "no projection provided");
  });
});


test('test GET product by id', (t) => {
  t.plan(4);

  seneca.act({role: 'warehouse', resource:'product', cmd: 'GET'},
  {
    productId: firstProduct._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, firstProduct._id, "mapped id");
    t.false(result.select, "no select");
    t.false(result.ops, "no options");
  });
});


test('test PUT product', (t) => {
  t.plan(4);

  //Update firstProduct info
  firstProduct.tags = firstProduct.tags.concat(['light']);
  const partial = {
    tags: firstProduct.tags
  };

  seneca.act({role: 'warehouse', resource:'product', cmd: 'PUT'},
  {
    productId: firstProduct._id,
    body: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, firstProduct._id, "mapped id");
    t.looseEquals(result.doc, partial, "partial as doc");
    t.false(result.ops, "no options");
  });
});


test('test DELETE product', (t) => {
  t.plan(3);

  seneca.act({role: 'warehouse', resource:'product', cmd: 'DELETE'},
  {
    productId: firstProduct._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.id, firstProduct._id, "mapped id");
    t.false(result.ops, "no options");
  });
});


test('shutdown', function(t) {
  t.plan(1);
  t.equal(1, 1);
  setTimeout(function() { process.exit(0); }, 100);
});
