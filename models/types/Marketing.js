
const Ad = {
  id:{ type: String, required:[true, 'Missing required field [  id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  img:{ type: String, required:[true, 'Missing required field [  img]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  expiration: String
};

const Campaign = {
  id:{ type: String, required:[true, 'Missing required field [id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  tags:{ type: [String], required:[true, 'Missing required field [  tags]']},
  ads:{ type: [Ad], required:[true, 'Missing required field [  ads]']},
  expiration: String
};

module.exports = {
  Ad:Ad,
  Campaign:Campaign
};
