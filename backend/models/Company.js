const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  devId: String,
  name: String,
  type: String,
  buildingsCompleted: Number,
  contactInfo: String,
  email: String,
  officeLocation: String,
  rating: Number
});
module.exports = mongoose.model('Company', schema, 'companies');
