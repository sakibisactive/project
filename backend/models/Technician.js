const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  techId: String,
  name: String,
  type: String,
  specialty: String,
  worksCompleted: Number,
  contactInfo: String,
  rating: Number
});
module.exports = mongoose.model('Technician', schema, 'technicians');
