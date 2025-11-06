const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');

// POST /api/offer/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { propertyId, offerPrice, originalPrice } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    const offer = new Offer({
      propertyId,
      userId,
      userName,
      offerPrice,
      originalPrice,
      discount: originalPrice - offerPrice,
      status: 'pending'
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/offer/my-offers
router.get('/my-offers', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const offers = await Offer.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
