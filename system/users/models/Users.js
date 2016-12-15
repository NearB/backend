var mongoose = require('mongoose');

const UserModel = {
  authId:{ type: String, required:[true, 'Missing required field [authId]']},
  username:{ type: String, required:[true, 'Missing required field [username]']},
  name:{ type: String, required:[true, 'Missing required field [name]']},
  profile: Object,
  stores: [String],
  filters: [String],
};

var userSchema = mongoose.Schema(UserModel);

const User = mongoose.model('User', userSchema);

module.exports = {
  User:User,
  // Owner:Owner,
  // Client: Client
};
