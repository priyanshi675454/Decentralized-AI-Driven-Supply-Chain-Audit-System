const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateTrustScore
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProduct);
router.get('/', protect, getProducts);
router.get('/:productId', getProductById);
router.put('/trust', protect, updateTrustScore);

module.exports = router;