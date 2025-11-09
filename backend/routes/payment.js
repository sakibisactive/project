// Replace/update your existing payment.js with this function

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Referral = require('../models/Referral');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

// POST /api/payment/initiate
router.post('/initiate', auth, async (req, res) => {
  try {
    const userId = req.user._id;
  const { amount, method, hasReferral, referralCode } = req.body;

    // Determine pricing rules
    let finalAmount = amount;
    let discount = 0;

    const user = await User.findById(userId);
    const referral = await Referral.findOne({ userId: userId });

    if (user.role === 'non-premium') {
      // Non-premium upgrading: 1000 or 900 if referred
      finalAmount = referral ? 900 : 1000;
      discount = referral ? 100 : 0;
    } else if (user.role === 'premium') {
      // Premium pricing for renewal/repayment
      if (user.hasReferred) {
        finalAmount = 800;
        discount = 200;
      } else if (user.referred === 'YES') {
        finalAmount = 900;
        discount = 100;
      } else {
        finalAmount = 1000;
      }
    }

    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${userId.slice(-6)}`;

    // Create payment record
    const payment = new Payment({
      userId,
      amount: finalAmount,
      originalAmount: amount,
      discount: discount,
      method: method,
      transactionId: transactionId,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      paymentInfo: {
        transactionId: transactionId,
        amount: finalAmount,
        originalAmount: amount,
        discount: discount,
        method: method,
        merchantNumber: '01234567890' // Replace with your actual merchant number
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/payment/confirm
router.post('/confirm', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { transactionId, amount, method } = req.body;

    // Find payment record
    const payment = await Payment.findOne({
      userId: userId,
      transactionId: transactionId
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Update payment status
    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    // Update user to premium
    const user2 = await User.findById(userId);
    user2.role = 'premium';
    user2.premiumStartDate = new Date();
    user2.premiumEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user2.save();

    // Send confirmation notification to admin
    try {
      await axios.post('http://localhost:5001/api/admin/notification', {
        type: 'payment_confirmed',
        userId: userId,
        userName: user.name,
        userEmail: user.email,
        amount: amount,
        method: method,
        transactionId: transactionId,
        discount: payment.discount,
        message: `Payment confirmed! ${user.name} is now premium member. Transaction: ${transactionId}`
      });
    } catch (notificationError) {
      console.log('Notification error:', notificationError.message);
    }

    res.json({
      success: true,
      message: 'Payment confirmed and premium membership activated'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
