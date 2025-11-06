const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// GET /api/price-analysis?location={location}&propertyType={type}
router.get('/', auth, async (req, res) => {
  try {
    const { location, propertyType } = req.query;

    if (!location || !propertyType) {
      return res.status(400).json({
        success: false,
        message: 'Location and propertyType are required'
      });
    }

    // Find properties matching criteria (make status flexible)
    const properties = await Property.find({
      location: location,
      propertyType: propertyType,
      status: { $in: ['available', 'approved'] } // More flexible: include available/approved
    });

    if (!properties || properties.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Group by year and calculate average price
    const priceByYear = {};
    properties.forEach(prop => {
      const year = new Date(prop.createdAt).getFullYear();
      if (!priceByYear[year]) {
        priceByYear[year] = { total: 0, count: 0 };
      }
      priceByYear[year].total += prop.price;
      priceByYear[year].count += 1;
    });

    const result = Object.keys(priceByYear)
      .sort()
      .map(year => ({
        year: parseInt(year),
        averagePrice: Math.round(priceByYear[year].total / priceByYear[year].count)
      }));

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('[PriceAnalysis]', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
