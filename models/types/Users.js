
const User = {
  username:{ type: String, required:[true, 'Missing required field [username]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  fbId: String
};

const Owner = {
  username:{ type: String, required:[true, 'Missing required field [username]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  stores: { type: [String], required:[true, 'Missing required field [  stores]']},
  fbId: String
};

const Client = {
  username:{ type: String, required:[true, 'Missing required field [username]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  favorites: { type: [String], required:[true, 'Missing required field [  favorites]']},
  filters:{ type: [String], required:[true, 'Missing required field [  filters]']},
  fbId: String
};

module.exports = {};
