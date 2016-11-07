var mongoose = require('mongoose');

const AdModel = {
  name:{ type: String, required:[true, 'Missing required field [name]']},
  img:{ type: String, required:[true, 'Missing required field [img]']},
  tags:{ type: [String], required:[true, 'Missing required field [tags]']},
  expiration: String
};

const CampaignModel = {
  name:{ type: String, required:[true, 'Missing required field [name]']},
  tags:{ type: [String], required:[true, 'Missing required field [tags]']},
  ads: { type: [String], required:[true, 'Missing required field [ads]']},
  expiration: String
};


var adSchema = mongoose.Schema(AdModel);
var campaignSchema = mongoose.Schema(CampaignModel);

const Ad = mongoose.model('Ad', adSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {
  Ad:Ad,
  Campaign:Campaign
};
