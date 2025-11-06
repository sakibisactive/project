const mongoose = require('mongoose');

// Property.js
const propertySchema = new mongoose.Schema({
  // ...
  latitude: Number,
  longitude: Number
});

// School.js / Hospital.js / Market.js
const schoolSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number
});
const hospitalSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number
});
const marketSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number
});

const userSchema = new mongoose.Schema({
  // REMOVE custom _id
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'premium', 'non-premium'],
    default: 'non-premium'
  },
  verified: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date,
    default: null
  },
  favorites: [{
    type: mongoose.Schema.Types.String,
    ref: 'Property'
  }],
  deletionRequested: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Referral flags
  referred: {
    type: String,
    enum: ['NO', 'YES'],
    default: 'NO'
  },
  hasReferred: {
    type: Boolean,
    default: false
  },
  // Add this if you still want a friendly code (OPTIONAL)
  userCode: {
    type: String
  },
  latitude: { type: Number },
longitude: { type: Number }

});

module.exports = mongoose.model('User', userSchema);
