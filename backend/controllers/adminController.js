const User = require('../models/User');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const Story = require('../models/Story');
const Meeting = require('../models/Meeting');
const Property = require('../models/Property');
const Faq = require('../models/Faq');

exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ 
      role: 'premium', 
      verified: false 
    }).select('-password');

    console.log('Pending verifications found:', users.length);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error in getPendingVerifications:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingDeletions = async (req, res) => {
  try {
    const users = await User.find({ 
      deletionRequested: true 
    }).select('-password');

    console.log('Pending deletions found:', users.length);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error in getPendingDeletions:', error);
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
    // First, let's check if we have any users with premium role
    const allPremiumUsers = await User.find({ role: 'premium' }).select('-password');
    console.log('All premium users found:', allPremiumUsers.length);

    // Get all verified premium users
    const verifiedPremiumMembers = await User.find({ 
      role: 'premium',
      verified: true 
    }).select('-password');
    
    console.log('Verified premium members found:', verifiedPremiumMembers.length);

    // For debugging, let's also check unverified premium users
    const unverifiedPremiumMembers = await User.find({ 
      role: 'premium',
      verified: false 
    }).select('-password');
    
    console.log('Unverified premium members found:', unverifiedPremiumMembers.length);

    // Send all data for now (we can adjust this later)
    res.json({ 
      success: true, 
      premiumMembers: allPremiumUsers,
      debug: {
        totalPremium: allPremiumUsers.length,
        verifiedCount: verifiedPremiumMembers.length,
        unverifiedCount: unverifiedPremiumMembers.length
      }
    });
  } catch (error) {
    console.error('Error in getPremiumMembers:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.handleStory = async (req, res) => {
  try {
    const { action } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.status = action === 'approve' ? 'approved' : 'rejected';
    await story.save();

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: action === 'approve' ? 'approved' : 'rejected',
      targetType: 'story',
      targetId: story._id,
      details: `${action === 'approve' ? 'Approved' : 'Rejected'} story: ${story._id}`
    });

    // Notify user
    await Notification.create({
      userId: story.userId,
      type: 'story',
      message: `Your story has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      relatedId: story._id
    });

    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleMeeting = async (req, res) => {
  try {
    const { action } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    meeting.status = action === 'approve' ? 'approved' : 'rejected';
    await meeting.save();

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: action === 'approve' ? 'approved' : 'rejected',
      targetType: 'meeting',
      targetId: meeting._id,
      details: `${action === 'approve' ? 'Approved' : 'Rejected'} meeting: ${meeting._id}`
    });

    // Notify user
    await Notification.create({
      userId: meeting.userId,
      type: 'meeting',
      message: `Your meeting request has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      relatedId: meeting._id
    });

    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ status: 'pending' })
      .populate('userId', 'name')
      .populate('propertyId', 'propertyType location')
      .sort({ createdAt: -1 });

    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingQuestions = async (req, res) => {
  try {
    const questions = await Faq.find({ answer: '' })
      .populate('askedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Faq.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.answer = answer;
    question.answeredBy = req.user._id;
    await question.save();

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'answered',
      targetType: 'question',
      targetId: question._id,
      details: `Answered question: ${question._id}`
    });

    // Notify user
    await Notification.create({
      userId: question.askedBy,
      type: 'question',
      message: 'Your question has been answered',
      relatedId: question._id
    });

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Log action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'deleted',
      targetType: 'property',
      targetId: property._id,
      details: `Deleted property: ${property._id}`
    });

    await property.deleteOne();

    // Notify property owner
    await Notification.create({
      userId: property.userId,
      type: 'property',
      message: 'Your property listing has been removed by an admin',
      relatedId: property._id
    });

    res.json({ success: true, message: 'Property deleted successfully' });
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
