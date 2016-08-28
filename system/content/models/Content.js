var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//TODO complete this schema!
// review if is better to have an Embedded document pattern where
// {store: id, content:[{item}, {item}, {item}]}
var contentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'How do they order this content?']
  },
  _store: {
    type: ObjectId,
    required: [true, 'The Content in the Warehouse has to be available in some Store']
  },
  _owner: {
    type: String,
    required: [true, 'Who does this Content belong to?']
  },
  img: String,
  description: String,
  price: Number
});

module.exports = mongoose.model('Content', contentSchema);
