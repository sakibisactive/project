const Wishlist = require('../models/Wishlist');
// ensure you have "const mongoose = require('mongoose');" at the top

exports.createWishlist = async (req, res) => {
  try {
    // Always use the MongoDB _id from user auth/session
    const wishlist = new Wishlist({
      userId: mongoose.Types.ObjectId(req.user._id),
      propertyId: req.body.propertyId,
      // any other fields...
    });
    await wishlist.save();
    res.status(201).json({ message: 'Added to wishlist', wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
