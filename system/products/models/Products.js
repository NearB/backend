var mongoose = require('mongoose');

const ProductModel = {
  id:{ type: String, required:[true, 'Missing required field [  id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  img:{ type: String, required:[true, 'Missing required field [  img]']},
  description: String
};

const CartProductModel = {
  id:{ type: String, required:[true, 'Missing required field [  id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  img:{ type: String, required:[true, 'Missing required field [  img]']},
  quantity:{ type: Number, required:[true, 'Missing required field [  quantity]']},
  price:{ type: Number, required:[true, 'Missing required field [  price]']},
  description: String
};

const CartModel = {
  id: { type: Number, required:[true, 'Missing required field [  id]']},
  total:{ type: Number, required:[true, 'Missing required field [  total]']},
  products:{ type: [String], required:[true, 'Missing required field [  products]']},
  discount: Number
};


var productSchema = mongoose.Schema(ProductModel);
var cartProductSchema = mongoose.Schema(CartProductModel);
var cartSchema = mongoose.Schema(CartModel);

const Product = mongoose.model('Product', productSchema);
const CartProduct = mongoose.model('CartProduct', cartProductSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
  Product:Product,
  CartProduct:CartProduct,
  Cart:Cart
};
