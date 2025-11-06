const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
  // createdAt, updatedAt will be auto-added if you want: { timestamps: true }
});

module.exports = mongoose.model('School', schoolSchema);
