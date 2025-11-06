const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.String,
    ref: 'Property',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    default: null
  }
});

module.exports = mongoose.model('Story', storySchema);
