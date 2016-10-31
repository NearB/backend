var mongoose = require('mongoose');

const UserModel = {
  username:{ type: String, required:[true, 'Missing required field [username]']},
  name:{ type: String, required:[true, 'Missing required field [name]']},
  stores: [String],
  filters: [String],
  fbId: String
};

// REVIEW Probably overkill
// const OwnerModel = {
//   username:{ type: String, required:[true, 'Missing required field [username]']},
//   name:{ type: String, required:[true, 'Missing required field [name]']},
//   stores: { type: [String], required:[true, 'Missing required field [stores]']},
//   fbId: String
// };
//
// const ClientModel = {
//   username:{ type: String, required:[true, 'Missing required field [username]']},
//   name:{ type: String, required:[true, 'Missing required field [name]']},
//   favorites: { type: [String], required:[true, 'Missing required field [favorites]']},
//   filters:{ type: [String], required:[true, 'Missing required field [filters]']},
//   fbId: String
// };

var userSchema = mongoose.Schema(UserModel);
// var ownerSchema = mongoose.Schema(OwnerModel);
// var clientSchema = mongoose.Schema(ClientModel);

const User = mongoose.model('User', userSchema);
// const Owner = mongoose.model('Owner', ownerSchema);
// const Client = mongoose.model('Client', clientSchema);

module.exports = {
  User:User,
  // Owner:Owner,
  // Client: Client
};
