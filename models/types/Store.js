const ProductStock = {
  productId:{ type: String, required:[true, 'Missing required field[  productId]']},
  price:{ type: Number, required:[true, 'Missing required field[  price]']},
  stock:{ type: Number, required:[true, 'Missing required field[  stock]']}
};

const Store = {
  id:{ type: String, required:[true, 'Missing required field [id]']},
  name:{ type: String, required:[true, 'Missing required field [name]']},
  ownerId:{ type: String, required:[true, 'Missing required field [ownerId]']},
  stock:{ type: [ProductStock], required:[true, 'Missing required field [stock]']},
  locations:{ type: [String], required:[true, 'Missing required field [locations]']},
  adTags:{ type: [String], required:[true, 'Missing required field[  adTags]']}
  campaignTags: [String],
};

module.exports = {
  ProductStock:ProductStock,
  Store:Store
};
