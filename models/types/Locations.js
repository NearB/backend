
const Location = {
  id:{ type: String, required:[true, 'Missing required field [id]']},
  name:{ type: String, required:[true, 'Missing required field [  name]']},
  coordinates:{ type: String, required:[true, 'Missing required field [  coordinates]']},
  fingerprint:{ type: [Fingerprint], required:[true, 'Missing required field [  fingerprint]']},
  address: String
};

const TrackingInformation = {
  group:{ type: String, required:[true, 'Missing required field [group]']},
  username:{ type: String, required:[true, 'Missing required field [  username]']},
  locationName:{ type: String, required:[true, 'Missing required field [  locationName]']},
  timestamp:{ type: String, required:[true, 'Missing required field [  timestamp]']},
  wifi-fingerprint:{ type: [Fingerprint], required:[true, 'Missing required field [  wifi-fingerprint]']}
}

const Fingerprint = {
  mac: String,
  level: Number
}

module.exports = {
  Fingerprint: Fingerprint,
  TrackingInformation: TrackingInformation,
  Location: Location
};
