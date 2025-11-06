const User = require('../models/User');

exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    let user = await User.findById(req.user._id);

    if (!user.favorites.includes(propertyId)) {
      user.favorites.push(propertyId);
      await user.save();
    }

    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    let user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(id => id !== propertyId);
    await user.save();

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Note: You'll need to populate these with actual property data
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
