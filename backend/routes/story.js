const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createStory,
  getStories,
  approveStory
} = require('../controllers/storyController');
const Story = require('../models/Story'); // Ensure your Story model is imported here

// Create a new story (premium only)
router.post('/', auth, roleCheck('premium'), createStory);

// Get all stories
router.get('/', auth, getStories);

// Get stories by user
router.get('/user/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const stories = await Story.find({ userId });
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch user stories' });
  }
});

// Approve a story (admin only)
router.post('/:id/approve', auth, roleCheck('admin'), approveStory);

module.exports = router;
