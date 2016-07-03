var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Store', storeSchema);
