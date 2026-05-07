const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['food', 'pharma', 'electronics', 'textile', 'other'],
    default: 'other'
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trustScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'verified', 'rejected'],
    default: 'active'
  },
  blockchainTxHash: {
    type: String,
    default: null
  },
  qrCode: {
    type: String,
    default: null
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);