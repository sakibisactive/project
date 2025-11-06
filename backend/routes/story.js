const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createStory,
  getStories,
  approveStory
} = require('../controllers/storyController');

router.post('/', auth, roleCheck('premium'), createStory);
router.get('/', auth, getStories);
router.post('/:id/approve', auth, roleCheck('admin'), approveStory);

module.exports = router;