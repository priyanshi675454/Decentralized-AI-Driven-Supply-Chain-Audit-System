const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  shippingTime: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['in-transit', 'warehouse', 'delivered', 'flagged'],
    default: 'in-transit'
  },
  aiRiskScore: {
    type: Number,
    default: 0
  },
  aiFlag: {
    type: Boolean,
    default: false
  },
  blockchainTxHash: {
    type: String,
    default: null
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);