const axios = require('axios');

const analyzeShipment = async (shipmentData) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze`,
      shipmentData,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error('AI Service error:', error.message);
    // Fallback: basic rule-based scoring if AI is down
    return fallbackAnalysis(shipmentData);
  }
};

// Basic fallback if Python AI service is not running
const fallbackAnalysis = (data) => {
  let riskScore = 0;

  // Temperature anomaly check
  if (data.category === 'food' || data.category === 'pharma') {
    if (data.temperature > 8 || data.temperature < -2) {
      riskScore += 40;
    }
  }

  // Shipping time anomaly
  if (data.shippingTime > 72) {
    riskScore += 30;
  }

  // Humidity anomaly
  if (data.humidity > 90 || data.humidity < 10) {
    riskScore += 20;
  }

  return {
    riskScore,
    isAnomaly: riskScore >= 40,
    method: 'fallback'
  };
};

module.exports = { analyzeShipment };