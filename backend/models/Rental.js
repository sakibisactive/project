const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['PLOT', 'APARTMENT', 'BUILDING'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rentPrice: {
    type: Number,
    required: true
  },
  floorNumber: {
    type: Number,
    default: null
  },
  flatsPerFloor: {
    type: Number,
    default: null
  },
  roomsPerFlat: {
    type: Number,
    default: null
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
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'rented'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rental', rentalSchema);
