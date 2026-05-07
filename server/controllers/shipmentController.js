const Shipment = require('../models/Shipment');
const Product = require('../models/Product');
const aiService = require('../services/aiService');

// Add shipment checkpoint
const addShipment = async (req, res) => {
  try {
    const { productId, location, temperature, humidity, shippingTime, notes } = req.body;

    // Find product
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Call AI service for anomaly detection
    let aiRiskScore = 0;
    let aiFlag = false;

    try {
      const aiResult = await aiService.analyzeShipment({
        temperature,
        humidity,
        shippingTime,
        category: product.category
      });
      aiRiskScore = aiResult.riskScore;
      aiFlag = aiResult.isAnomaly;
    } catch (aiError) {
      console.log('AI service unavailable, using default score');
    }

    // Create shipment record
    const shipment = await Shipment.create({
      product: product._id,
      updatedBy: req.user._id,
      location,
      temperature,
      humidity,
      shippingTime,
      notes,
      aiRiskScore,
      aiFlag,
      status: aiFlag ? 'flagged' : 'in-transit'
    });

    // Update product trust score based on AI
    if (aiFlag) {
      const newTrustScore = Math.max(0, product.trustScore - 20);
      await Product.findByIdAndUpdate(product._id, {
        trustScore: newTrustScore,
        status: newTrustScore < 40 ? 'flagged' : 'active'
      });
    }

    // Get updated product
    const updatedProduct = await Product.findById(product._id);

    res.status(201).json({
      success: true,
      shipment,
      trustScore: updatedProduct.trustScore,
      aiFlag,
      aiRiskScore,
      message: aiFlag
        ? 'ANOMALY DETECTED - Shipment flagged for review'
        : 'Checkpoint recorded successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all shipments for a product
const getShipments = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const shipments = await Shipment.find({ product: product._id })
      .populate('updatedBy', 'name role')
      .sort({ createdAt: 1 });

    res.json({ success: true, shipments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addShipment, getShipments };