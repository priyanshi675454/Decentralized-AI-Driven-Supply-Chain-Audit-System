const express = require('express');
const router = express.Router();
const { addShipment, getShipments } = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addShipment);
router.get('/:productId', getShipments);

module.exports = router;