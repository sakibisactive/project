const Story = require('../models/Story');
const Notification = require('../models/Notification');

exports.createStory = async (req, res) => {
  try {
    const { propertyId, title, content } = req.body;

    const story = await Story.create({
      propertyId,
      userId: req.user._id,
      title,
      content,
      status: 'pending',  // Assuming new stories start as pending
      createdAt: new Date(),
    });

    // Notify admin about new story submission
    await Notification.create({
      userId: 'ADMIN001',  // You may want to fetch real admin id(s) here
      type: 'story',
      message: `New story submitted by ${req.user.name}`,
      relatedId: story._id,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Server error while creating story' });
  }
};

exports.getStories = async (req, res) => {
  try {
    // Admin sees all stories; others see only approved stories
    const query = req.user.role === 'admin' ? {} : { status: 'approved' };

    const stories = await Story.find(query)
      .populate('userId', 'name')
      .populate('propertyId', 'propertyType location')
      .sort({ createdAt: -1 });  // Sort by newest first

    res.json({ success: true, stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Server error while fetching stories' });
  }
};

exports.approveStory = async (req, res) => {
  try {
    const { action } = req.body; // Expected values: 'approve' or 'reject'

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.status = action === 'approve' ? 'approved' : 'rejected';
    story.approvedAt = new Date();
    story.approvedBy = req.user._id;
    await story.save();

    // Notify user about approval/rejection
    await Notification.create({
      userId: story.userId,
      type: 'story',
      message: `Your story has been ${story.status}`,
      relatedId: story._id,
      createdAt: new Date(),
    });

    res.json({ success: true, story });
  } catch (error) {
    console.error('Error approving story:', error);
    res.status(500).json({ error: 'Server error while updating story status' });
  }
};
