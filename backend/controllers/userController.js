const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'age', 'location', 'occupation', 'latitude', 'longitude'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestDeletion = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    user.deletionRequested = true;
    await user.save();

    // Notify admin
    await Notification.create({
      userId: 'ADMIN001',
      type: 'deletion',
      message: `Account deletion request from ${user.name}`,
      relatedId: user._id
    });

    res.json({ success: true, message: 'Deletion request sent to admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
