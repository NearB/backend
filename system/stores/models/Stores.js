var mongoose = require('mongoose');

const ProductStockModel = {
  productId:{ type: String, required:[true, 'Missing required field[productId]']},
  price:{ type: Number, required:[true, 'Missing required field[price]']},
  stock:{ type: Number, required:[true, 'Missing required field[stock]']}
};

const productStockSchema = mongoose.Schema(ProductStockModel, { _id : false });
const ProductStock = mongoose.model('ProductStock', productStockSchema);

const StoreModel = {
  name:{ type: String, required:[true, 'Missing required field [name]']},
  ownerId:{ type: String, required:[true, 'Missing required field [ownerId]']},
  stock:{ type: [productStockSchema], required:[true, 'Missing required field [stock]']},
  locations:{ type: [String], required:[true, 'Missing required field [locations]']},
  adTags: [String],
  campaignTags: [String]
};

const storeSchema = mongoose.Schema(StoreModel);
const Store = mongoose.model('Store', storeSchema);

module.exports = {
  Store:Store,
  ProductStock:ProductStock
};
