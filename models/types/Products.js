const Product = {
  id:{ type: String, required:[true, 'Missing required field [  id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  img:{ type: String, required:[true, 'Missing required field [  img]']},
  description: String
};

const CartProduct = {
  id:{ type: String, required:[true, 'Missing required field [  id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  img:{ type: String, required:[true, 'Missing required field [  img]']},
  quantity:{ type: Number, required:[true, 'Missing required field [  quantity]']},
  price:{ type: Number, required:[true, 'Missing required field [  price]']},
  description: String
};

const Cart = {
  id: { type: Number, required:[true, 'Missing required field [  id]']},
  total:{ type: Number, required:[true, 'Missing required field [  total]']},
  products:{ type: [CartProduct], required:[true, 'Missing required field [  products]']},
  discount: Number
};

module.exports = {
  Product: Product,
  CartProduct: CartProduct,
  Cart: Cart
};
