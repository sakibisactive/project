const Faq = require('../models/Faq');
const Notification = require('../models/Notification');

// Create a new FAQ question
exports.createFAQ = async (req, res) => {
  try {
    const { question } = req.body;

    const faq = await Faq.create({
      question,
      askedBy: req.user._id, // expects req.user from auth middleware
      status: 'pending'
    });

    // Notify admin (replace 'ADMIN001' with actual admin ObjectId if needed)
    await Notification.create({
      userId: 'ADMIN001', // Should be actual admin ID
      type: 'faq',
      message: `New FAQ question from ${req.user.name}`,
      relatedId: faq._id
    });

    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all FAQs (admins see all, others see answered only)
exports.getAllFAQs = async (req, res) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { status: 'answered' };

    const faqs = await Faq.find(query)
      .populate('askedBy', 'name email')
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pending FAQs (for admin/moderator)
exports.getPendingFAQs = async (req, res) => {
  try {
    const faqs = await Faq.find({ status: 'pending' })
      .populate('askedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin answers an FAQ
exports.answerFAQ = async (req, res) => {
  try {
    const { answer } = req.body;

    let faq = await Faq.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    faq.answer = answer;
    faq.status = 'answered';
    faq.answeredBy = req.user._id;
    faq.answeredAt = new Date();
    await faq.save();

    // Notify user who originally asked
    await Notification.create({
      userId: faq.askedBy,
      type: 'faq',
      message: 'Your FAQ question has been answered',
      relatedId: faq._id
    });

    res.json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
