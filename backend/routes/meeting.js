// In your existing meeting.js file, ADD/REPLACE this function:

const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');
const axios = require('axios');

// POST /api/meeting/request
router.post('/request', auth, async (req, res) => {
  try {
    const {
      userId,
      userName,
      companyId,
      companyName,
      companyType,
      message,
      propertyId,
      ownerId,
      ownerName
    } = req.body;

    // Create meeting request
    const meeting = new Meeting({
      userId,
      userName,
      userEmail: req.user.email,
      companyId,
      companyName,
      companyType,
      propertyId,
      ownerId,
      ownerName,
      message,
      status: 'pending',
      createdAt: new Date()
    });

    await meeting.save();

    // Send admin notification with proper format
    try {
      const notificationMessage = `
New Meeting Request!

📋 Details:
• User: ${userName}
• Email: ${req.user.email}
• Type: ${companyType}
• Company: ${companyName}

${propertyId ? `• Property ID: ${propertyId}` : ''}
${ownerName ? `• Owner: ${ownerName}` : ''}

📝 Message: ${message}

Status: Pending Admin Approval
Time: ${new Date().toLocaleString()}
      `.trim();

      await axios.post('http://localhost:5001/api/admin/notification', {
        type: 'meeting_request',
        meetingId: meeting._id,
        userId: userId,
        userName: userName,
        userEmail: req.user.email,
        companyName: companyName,
        companyType: companyType,
        message: notificationMessage,
        priority: 'high'
      });
    } catch (notificationError) {
      console.log('Notification error:', notificationError.message);
      // Don't fail the main request if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Meeting request sent to admin',
      meetingId: meeting._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/meeting/all (for admin)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
