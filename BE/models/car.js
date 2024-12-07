const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
    trim: true
  },
  Model: {
    type: String,
    required: true,
    trim: true
  },
  AccelSec: {
    type: Number,
    default: 0
  },
  TopSpeed_KmH: {
    type: Number,
    default: 0
  },
  Range_Km: {
    type: Number,
    default: 0
  },
  Efficiency_WhKm: {
    type: Number,
    default: 0
  },
  FastCharge_KmH: {
    type: Number,
    default: 0
  },
  RapidCharge: {
    type: String,
    default: ''
  },
  PowerTrain: {
    type: String,
    default: ''
  },
  PlugType: {
    type: String,
    default: ''
  },
  BodyStyle: {
    type: String,
    default: ''
  },
  Segment: {
    type: String,
    default: ''
  },
  Seats: {
    type: Number,
    default: 0
  },
  PriceEuro: {
    type: Number,
    default: 0
  },
  Date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text indexes for search functionality
carSchema.index({
  Brand: 'text',
  Model: 'text',
  BodyStyle: 'text',
  PowerTrain: 'text'
});

module.exports = mongoose.model('Car', carSchema); 