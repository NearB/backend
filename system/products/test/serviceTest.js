'use strict';

process.env.SERVICE_HOST = 'localhost';
process.env.SERVICE_PORT = 3001;

// Necessary for using mockgoose connection wrapper
process.env.TESTING = true;

var test = require('tape');
var seneca = require('../service').seneca;

const firstProduct = {
  name: 'Belgian Pale Ale',
  tags: ['beer', 'blonde'],
  img: 'http://blog.twobeerdudes.com/wp-content/uploads/2012/08/brett_backspin_belgian_pale_ale.jpg',
  description: 'abv: 4.0-7.0%, delicate hop finish, sweetish to toasty malt overtones'
};

const secondProduct = {
  name: 'Coffee Stout',
  tags: ['beer', 'stout'],
  img: 'https://s3.amazonaws.com/brewerydbapi/beer/onGh9g/upload_VuPXQJ-medium.png',
  description: 'ABV: 5.7%, IBU: 30, Pale, Caramel, Roasted Barley, Oats'
};


const firstCartProduct = {
  productId: '', //To be populated on product create
  quantity: 2,
  price: 5
};

const secondCartProduct = {
  productId: '', //To be populated on product create
  quantity: 20,
  price: 1
};

const cart = {
  total: 0,
  products: [],
  discount: 0
};

//=========== TESTS ARE SECUENTIAL, KEEP THAT IN MIND ===========

// ============= Product =============
test('test products create', (t) => {
  t.plan(6);

  seneca.act({role: 'products', cmd: 'create'},
  {
    product: firstProduct
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.name, firstProduct.name, "same product");
    t.ok(result._id, "added id");
    //Hackish
    firstProduct._id = result._id;
    firstCartProduct.productId = firstProduct._id.toString();
  });
  seneca.act({role: 'products', cmd: 'create'}, {product: secondProduct},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.name, secondProduct.name, "same product");
    t.ok(result._id, "added id");
    //Hackish
    secondProduct._id = result._id;
    secondCartProduct.productId = secondProduct._id.toString();
  });
});

test('test products read all', (t) => {
  t.plan(4);
  seneca.act({role: 'products', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "only created products found");

    result.forEach((element, index, array) => {
      if (element._id.toString() == firstProduct._id.toString()){
        t.looseEquals(element, firstProduct, "first included");
      } else if (element._id.toString() == secondProduct._id.toString()){
          t.looseEquals(element, secondProduct, "second included");
      } else {
        throw new Error("Invalid Product");
      }
    });
  });
});

test('test products read by id', (t) => {
  t.plan(6);

  seneca.act({role: 'products', cmd: 'read', type:'id'},
  {
    id: firstProduct._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "product found");
    t.looseEquals(result, firstProduct, "same product");
  });

  seneca.act({role: 'products', cmd: 'read', type:'id'},
  {
    id: secondProduct._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "product found");
    t.looseEquals(result, secondProduct, "same product");
  });
});

test('test products read with filters', (t) => {
  t.plan(8);

  seneca.act({role: 'products', cmd: 'read'},
  {
    where: {tags: firstProduct.tags}
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "product found");
    t.equal(result.length, 1, "only one product matched");
    t.looseEquals(result[0], firstProduct, "same product");
  });

  seneca.act({role: 'products', cmd: 'read'},
  {
    where: {tags: {"$all": ['beer']}}
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 2, "only created products found");

    result.forEach((element, index, array) => {
      if (element._id.toString() == firstProduct._id.toString()){
        t.looseEquals(element, firstProduct, "first included");
      } else if (element._id.toString() == secondProduct._id.toString()){
          t.looseEquals(element, secondProduct, "second included");
      } else {
        throw new Error("Invalid Product");
      }
    });
  });
});


test('test products update by id', (t) => {
  t.plan(4);

  //Update firstProduct info
  firstProduct.tags = firstProduct.tags.concat(['light']);
  const partial = {
    tags: firstProduct.tags
  };

  //Update in the DB
  seneca.act({role: 'products', cmd: 'update', type:'id'},
  {
    id: firstProduct._id,
    doc: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, firstProduct, "Returned modified product after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'products', cmd: 'read', type:'id'},
    {
      id: firstProduct._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.looseEquals(result, firstProduct, "Updated product matched");
    });
  });
});


// ============= Cart and CartProduct =============
test('test cart create', (t) => {
  t.plan(3);

  seneca.act({role: 'cart', cmd: 'create'}, {cart: cart},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.total, cart.total, "same cart");
    t.ok(result._id, "added id");
    //Hackish
    cart._id = result._id;
  });
});

test('test cart read all', (t) => {
  t.plan(3);
  seneca.act({role: 'cart', cmd: 'read'}, {},
  (err, result) => {
    t.equal(err, null, "no errors");
    t.equal(result.length, 1, "only created cart found");
    t.looseEquals(result[0], cart, "cart included");
  });
});

test('test cart read by id', (t) => {
  t.plan(3);

  seneca.act({role: 'cart', cmd: 'read', type:'id'},
  {
    id: cart._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.ok(result, "cart found");
    t.looseEquals(result, cart, "same cart");
  });
});

test('test cart update by id', (t) => {
  t.plan(4);

  //Update cart info
  cart.products = [firstCartProduct, secondCartProduct];
  cart.total = firstCartProduct.price * firstCartProduct.quantity +
               secondCartProduct.price * secondCartProduct.quantity;
  const partial = {
    products: cart.products,
    total: cart.total
  };

  //Update in the DB
  seneca.act({role: 'cart', cmd: 'update', type:'id'},
  {
    id: cart._id,
    doc: partial
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, cart, "Returned modified cart after update");

    //Read again to verify it's updated in the DB
    seneca.act({role: 'cart', cmd: 'read', type:'id'},
    {
      id: cart._id
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.looseEquals(result, cart, "Updated cart matched");
    });
  });
});


test('test products delete by id', (t) => {
  t.plan(4);

  seneca.act({role: 'products', cmd: 'delete', type:'id'},
  {
    id: secondProduct._id
  },
  (err, result) => {
    t.equal(err, null, "no errors");
    t.looseEquals(result, secondProduct, "same product");

    cart.products = [firstCartProduct];
    //Update cartProduct in DB
    seneca.act({role: 'cart', cmd: 'update', type:'id'},
    {
      id: cart._id,
      doc: cart
    },
    (err, result) => {
      t.equal(err, null, "no errors");
      t.looseEquals(result, cart, "Returned modified cart after update");
    });
  });
});

test('test products read after delete', (t) => {
  t.plan(2);

  seneca.act({role: 'products', cmd: 'read', type:'id'},
  {
    id: firstProduct._id
  },
  (err, result) => {
    t.notOk(err, "no errors");
    t.looseEquals(result, firstProduct, "first product remains");
  });
});

test('test cart read after delete', (t) => {
  t.plan(2);

  seneca.act({role: 'cart', cmd: 'read', type:'id'},
  {
    id: cart._id
  },
  (err, result) => {
    t.notOk(err, "no errors");
    t.looseEquals(result, cart, "cart with one product remains");
  });
});

test('test delete cart', (t) => {
  t.plan(4);

  seneca.act({role: 'cart', cmd: 'delete', type:'id'},
  {
    id: cart._id
  },
  (err, result) => {
    t.notOk(err, "no errors");
    t.looseEquals(result, cart, "same cart deleted");

    seneca.act({role: 'cart', cmd: 'read'},{},
    (err, result) => {
      t.notOk(err, "no errors");
      t.same(result.length, 0, "no carts");
    });
  });
});

test('shutdown', (t) => {
  t.plan(1);
  t.equal(1, 1, "Tests Completed");
  setTimeout(function() { process.exit(0); }, 100);
});
