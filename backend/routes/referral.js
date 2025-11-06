const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/referral/check
router.get('/check', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const referral = await Referral.findOne({ userId });

    res.json({
      success: true,
      hasReferral: !!referral,
      referralCode: referral?.referralCode,
      discount: referral?.discount || 500
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/referral/apply
router.post('/apply', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { referralCode } = req.body;

    // Check if already has referral
    const existing = await Referral.findOne({ userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a referral' });
    }

    // Find referrer by code (from user's referral code)
    const referrer = await User.findOne({ _id: referralCode.replace('GHORBARI_', '') });
    if (!referrer) {
      return res.status(400).json({ success: false, message: 'Invalid referral code' });
    }

    // Create referral record
    const referral = new Referral({
      userId,
      referrerId: referrer._id,
      referralCode,
      discount: 500
    });

    await referral.save();

    res.json({
      success: true,
      discount: 500,
      message: 'Referral applied successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/referral/referrer-stats
router.get('/referrer-stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const referredUsers = await Referral.find({
      referrerId: userId
    }).populate('userId', 'name email');

    res.json({
      success: true,
      isReferrer: referredUsers.length > 0,
      referredUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

// Additional endpoint: apply using last 6 of referrer's ID
// POST /api/referral/apply-code { code6 }
router.post('/apply-code', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { code6 } = req.body;
    if (!code6 || String(code6).length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }

    // Do not allow existing referral
    const existing = await Referral.findOne({ userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Referral already applied' });
    }

    // Find a premium user whose ObjectId ends with the code
    const referrer = await User.findOne({ role: 'premium' }).where('_id').regex(new RegExp(code6 + '$'));
    if (!referrer) {
      return res.status(404).json({ success: false, message: 'No premium member matches this code' });
    }

    await Referral.create({
      userId,
      referrerId: referrer._id,
      referralCode: code6,
      discount: 100 // discount to 900 (100 off)
    });

    // Mark referrer as someone who has referred
    if (!referrer.hasReferred) {
      referrer.hasReferred = true;
      await referrer.save();
    }

    // Mark applicant as referred=YES (used for pricing reference)
    const applicant = await User.findById(userId);
    applicant.referred = 'YES';
    await applicant.save();

    res.json({ success: true, message: 'Referral code accepted. Admin will review your upgrade.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});