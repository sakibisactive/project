const User = require('../models/User');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const Story = require('../models/Story');

exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ 
      role: 'premium', 
      verified: false 
    }).select('-password');

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveVerification = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.verified = true;
    await user.save();

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'verified',
      targetType: 'user',
      targetId: user._id,
      details: `Verified premium member: ${user.name}`
    });

    // Notify user
    await Notification.create({
      userId: user._id,
      type: 'verification',
      message: 'Your request for verification for premium membership is approved',
      relatedId: user._id
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectVerification = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Notify user
    await Notification.create({
      userId: user._id,
      type: 'verification',
      message: 'Your request for verification for premium membership is rejected',
      relatedId: user._id
    });

    res.json({ success: true, message: 'Verification rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'deleted',
      targetType: 'user',
      targetId: user._id,
      details: `Deleted account: ${user.name}`
    });

    await user.deleteOne();

    res.json({ success: true, message: 'User account deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'pending' })
      .populate('userId', 'name')
      .populate('propertyId', 'propertyType location')
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPremiumMembers = async (req, res) => {
  try {
    const premiumMembers = await User.find({ role: 'premium', verified: true }).select('-password');


    res.json({ success: true, premiumMembers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ role: 'premium' });
    const pendingVerifications = await User.countDocuments({ 
      role: 'premium', 
      verified: false 
    });
    const pendingStories = await Story.countDocuments({ status: 'pending' });

    res.json({ 
      success: true, 
      stats: {
        totalUsers,
        premiumUsers,
        pendingVerifications,
        pendingStories
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('adminId', 'name')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
