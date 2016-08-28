var mongoose = require('mongoose');

//TODO complete this schema!
var storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A [name] is required for all the Stores']
  },
  owner: {
    type: String,
    required: [true, 'An Store must always have an [owner]']
  },
  location: {
    coordinates: String,
    address: {
      type: String,
      required: [true, 'An Store must be somewhere']
    },
    fingerprint: Array
  }
});

module.exports = mongoose.model('Store', storeSchema);
