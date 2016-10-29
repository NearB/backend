module.exports = {
  Alert: {
    id:{ type: String, required:[true, 'Missing required field [id]']},
    tags:{ type: [String], required:[true, 'Missing required field[  tags]']},
    info:{ type: String, required:[true, 'Missing required field[  info]']},
    description: String,
    img: String
  }
};
