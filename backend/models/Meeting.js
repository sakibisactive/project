const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.String,
    ref: 'Property',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  meetingDate: {
    type: Date,
    required: false
  },
  meetingLocation: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
