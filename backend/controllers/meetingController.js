const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

exports.requestMeeting = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const meeting = await Meeting.create({
      propertyId,
      requestedBy: req.user._id,
      status: 'pending'
    });

    // Notify admin
    await Notification.create({
      userId: 'ADMIN001',
      type: 'meeting',
      message: `New meeting request from ${req.user.name} for property ${propertyId}`,
      relatedId: meeting._id
    });

    res.status(201).json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== 'admin') {
      query.requestedBy = req.user._id;
    }

    const meetings = await Meeting.find(query)
      .populate('propertyId')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveMeeting = async (req, res) => {
  try {
    const { meetingDate, meetingLocation, notes } = req.body;

    let meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    meeting.status = 'approved';
    meeting.meetingDate = meetingDate;
    meeting.meetingLocation = meetingLocation;
    meeting.notes = notes;
    meeting.approvedBy = req.user._id;
    await meeting.save();

    // Notify user
    await Notification.create({
      userId: meeting.requestedBy,
      type: 'meeting',
      message: `Your meeting request has been approved for ${meetingDate} at ${meetingLocation}`,
      relatedId: meeting._id
    });

    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};