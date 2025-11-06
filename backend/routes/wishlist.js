const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const axios = require('axios');
const mongoose = require('mongoose');

// GET /api/wishlist
router.get('/', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log('userId:', userId);
    const wishlist = await Wishlist.findOne({ userId }).populate('properties');
    console.log('wishlist:', wishlist);
    res.json({ success: true, wishlist: wishlist?.properties || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/add
router.post('/add', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { propertyId } = req.body;

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, properties: [] });
    }

    if (!wishlist.properties.map(String).includes(String(propertyId))) {
      wishlist.properties.push(propertyId);
      wishlist.propertyPrices = wishlist.propertyPrices || {};
      wishlist.propertyPrices[propertyId] = property.price;
      await wishlist.save();
    }

    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/remove
router.post('/remove', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { propertyId } = req.body;

    await Wishlist.updateOne(
      { userId },
      { $pull: { properties: propertyId } }
    );

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/wishlist/check/:propertyId
router.get('/check/:propertyId', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { propertyId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId,
      properties: propertyId
    });

    res.json({ success: true, isWishlisted: !!wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/check-price-drops
router.post('/check-price-drops', async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate('properties');

    for (let wishlist of wishlists) {
      for (let property of wishlist.properties) {
        const originalPrice = wishlist.propertyPrices?.[property._id];
        const currentPrice = property.price;

        if (originalPrice && currentPrice < originalPrice) {
          const savings = originalPrice - currentPrice;
          const savingsPercent = Math.round((savings / originalPrice) * 100);

          try {
            await axios.post('http://localhost:5000/api/admin/notification', {
              type: 'price_drop',
              userId: wishlist.userId,
              propertyId: property._id,
              propertyTitle: property.propertyTitle || 'Property',
              originalPrice: originalPrice,
              currentPrice: currentPrice,
              savings: savings,
              savingsPercent: savingsPercent,
              message: `Price drop! 📉 Property price decreased from TK ${originalPrice.toLocaleString()} to TK ${currentPrice.toLocaleString()} (Save TK ${savings.toLocaleString()}, ${savingsPercent}% off!)`
            });

            wishlist.propertyPrices[property._id] = currentPrice;
          } catch (err) {
            console.log('Failed to notify about price drop:', err.message);
          }
        }
      }
      await wishlist.save();
    }

    res.json({ success: true, message: 'Price check completed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
