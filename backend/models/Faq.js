const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  askedBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  answeredBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'answered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Faq', faqSchema);
