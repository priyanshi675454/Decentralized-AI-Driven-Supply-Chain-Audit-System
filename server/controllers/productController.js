const Product = require('../models/Product');
const aiService = require('../services/aiService');
const solanaService = require('../services/solanaService');
const { v4: uuidv4 } = require('crypto');

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const productId = `DT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const product = await Product.create({
      name,
      description,
      category,
      productId,
      manufacturer: req.user._id,
      trustScore: 100,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products (for logged in user)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ manufacturer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID (public - for QR scan)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId })
      .populate('manufacturer', 'name company');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trust score
const updateTrustScore = async (req, res) => {
  try {
    const { productId, trustScore, status } = req.body;

    const product = await Product.findOneAndUpdate(
      { productId },
      { trustScore, status },
      { new: true }
    );

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateTrustScore };