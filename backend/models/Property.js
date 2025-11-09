const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ['Plot', 'Apartment', 'Building'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerContact: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  virtualTour: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  priceHistory: [{
    price: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  // ADDED FIELD: for search filtering requirement
  option: {
    type: String,
    enum: ['Rent', 'Buy'],
    required: true
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

module.exports = mongoose.model('Property', propertySchema);
