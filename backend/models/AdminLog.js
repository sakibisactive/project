const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['user', 'property', 'story', 'faq', 'meeting'],
    required: true
  },
  targetId: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
