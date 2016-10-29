var mongoose = require('mongoose');

const ProductStockModel = {
  productId:{ type: String, required:[true, 'Missing required field[  productId]']},
  price:{ type: Number, required:[true, 'Missing required field[  price]']},
  stock:{ type: Number, required:[true, 'Missing required field[  stock]']}
};

const StoreModel = {
  id:{ type: String, required:[true, 'Missing required field [id]']},
  name:{ type: String, required:[true, 'Missing required field [name]']},
  ownerId:{ type: String, required:[true, 'Missing required field [ownerId]']},
  stock:{ type: [ProductStockModel], required:[true, 'Missing required field [stock]']},
  locations:{ type: [String], required:[true, 'Missing required field [locations]']},
  adTags:{ type: [String], required:[true, 'Missing required field[  adTags]']},
  campaignTags: [String],
};

var storeSchema = mongoose.Schema(StoreModel);
var productStockSchema = mongoose.Schema(ProductStockModel);

const Store = mongoose.model('Store', storeSchema);
const ProductStock = mongoose.model('ProductStock', productStockSchema);

module.exports = {
  Store:Store,
  ProductStock:ProductStock
};
