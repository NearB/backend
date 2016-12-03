var mongoose = require('mongoose');

//REVIEW Too similar to productStock, maybe we should unify
const CartProductModel = {
  productId:{ type: String, required:[true, 'Missing required field[productId]']},
  quantity:{ type: Number, required:[true, 'Missing required field [quantity]']},
  price:{ type: Number, required:[true, 'Missing required field [price]']}
};

var cartProductSchema = mongoose.Schema(CartProductModel, { _id : false });
const CartProduct = mongoose.model('CartProduct', cartProductSchema);

const ProductModel = {
  name:{ type: String, required:[true, 'Missing required field [name]']},
  tags:{ type: [String], required:[true, 'Missing required field [tags]']},
  img:{ type: String, required:[true, 'Missing required field [img]']},
  description: String
};
var productSchema = mongoose.Schema(ProductModel);
const Product = mongoose.model('Product', productSchema);

const CART_STATUS = {OPEN:'OPEN', PENDING_CHECKOUT:'CHECKOUT', CLOSED:'CLOSED'}

const CartModel = {
  total:{ type: Number, required:[true, 'Missing required field [total]']},
  engagement: { type: String, required:[true, 'Missing required field [engagement]']},
  storeId: { type: String, required:[true, 'Missing required field [storeId]']},
  status: { type: String, default: CART_STATUS.OPEN},
  products: [cartProductSchema],
  discount: Number
};
var cartSchema = mongoose.Schema(CartModel);
const Cart = mongoose.model('Cart', cartSchema);

cartSchema.pre('validate', function (next) {
   const store = this.get('storeId');
   if (!store) {
     const engagement = this.get('engagement');
     this.storeId = engagement.split(':')[1];
   }
   next();
 });

const ORDER_STATUS = {PENDING:'PENDING', DONE:'DONE', CANCELED:'CANCELED'}
const OrderModel = {
  cartId: { type: String, required:[true, 'Missing required field [cartId]']},
  storeId: { type: String, required:[true, 'Missing required field [storeId]']},
  engagement: { type: String, required:[true, 'Missing required field [engagement]']},
  status: { type: String, default: ORDER_STATUS.PENDING},
  products: [cartProductSchema]
};
var orderSchema = mongoose.Schema(OrderModel);
const Order = mongoose.model('Order', orderSchema);

orderSchema.pre('validate', function (next) {
   const store = this.get('storeId');
   if (!store) {
     const engagement = this.get('engagement');
     this.storeId = engagement.split(':')[1];
   }
   next();
 });

module.exports = {
  Product:Product,
  CartProduct:CartProduct,
  Cart:Cart,
  Order: Order
};
