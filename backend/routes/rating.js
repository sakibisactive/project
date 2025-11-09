// Create new file: backend/src/routes/rating.js
// OR replace existing one with this code:

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const axios = require('axios');

// POST /api/rating/submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { propertyId, rating } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Add or update rating
    const existingRating = property.ratings.find(
      r => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      property.ratings.push({ userId, rating, userName });
    }

    // Calculate average rating
    const avgRating =
      property.ratings.reduce((sum, r) => sum + r.rating, 0) /
      property.ratings.length;
    property.rating = parseFloat(avgRating.toFixed(1));
    property.ratingCount = property.ratings.length;

    await property.save();

    // If rating is 0, notify admin about poor experience
    if (parseInt(rating) === 0) {
      try {
        const alertMessage = `
⚠️ ALERT: Poor Property Rating

User: ${userName}
Property ID: ${propertyId}
Property Title: ${property.propertyTitle || 'N/A'}
Rating Given: 0/5 (Poor)

Location: ${property.location}
Price: TK ${property.price?.toLocaleString() || 'N/A'}
Owner: ${property.ownerName}

Action Required:
- Review property details
- Contact owner for improvements
- Follow up with user if needed

Rating Given At: ${new Date().toLocaleString()}
      `.trim();

        await axios.post('http://localhost:5001/api/admin/notification', {
          type: 'low_rating_alert',
          propertyId: propertyId,
          userId: userId,
          userName: userName,
          userEmail: req.user.email,
          rating: rating,
          message: alertMessage,
          priority: 'high',
          propertyTitle: property.propertyTitle,
          location: property.location,
          ownerName: property.ownerName
        });
      } catch (notificationError) {
        console.log('Failed to send low rating notification:', notificationError.message);
      }
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      newRating: property.rating,
      ratingCount: property.ratingCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/rating/{propertyId} - Get property ratings
router.get('/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId).select(
      'rating ratingCount ratings'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      rating: property.rating,
      ratingCount: property.ratingCount,
      ratings: property.ratings || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
