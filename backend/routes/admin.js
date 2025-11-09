const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getPendingDeletions,
  approveDeletion,
  getPendingStories,
  handleStory,
  getPendingMeetings,
  handleMeeting,
  getPendingQuestions,
  handleQuestion,
  getPremiumMembers,
  deleteProperty,
  getAdminStats,
  getAdminLogs
} = require('../controllers/adminController');

// Verification endpoints
router.get('/verifications/pending', auth, roleCheck('admin'), getPendingVerifications);
router.post('/verifications/:id/approve', auth, roleCheck('admin'), approveVerification);
router.post('/verifications/:id/reject', auth, roleCheck('admin'), rejectVerification);

// Account deletion endpoints
router.get('/deletions/pending', auth, roleCheck('admin'), getPendingDeletions);
router.post('/users/:id/delete-approve', auth, roleCheck('admin'), approveDeletion);

// Story endpoints
router.get('/stories/pending', auth, roleCheck('admin'), getPendingStories);
router.post('/stories/:id/handle', auth, roleCheck('admin'), handleStory);

// Meeting endpoints
router.get('/meetings/pending', auth, roleCheck('admin'), getPendingMeetings);
router.post('/meetings/:id/handle', auth, roleCheck('admin'), handleMeeting);

// FAQ endpoints
router.get('/questions/pending', auth, roleCheck('admin'), getPendingQuestions);
router.post('/questions/:id/handle', auth, roleCheck('admin'), handleQuestion);

// Premium members
router.get('/premium-members', auth, roleCheck('admin'), getPremiumMembers);

// Property management
router.delete('/properties/:id', auth, roleCheck('admin'), deleteProperty);

// Statistics and Logs
router.get('/stats', auth, roleCheck('admin'), getAdminStats);
router.get('/logs', auth, roleCheck('admin'), getAdminLogs);

module.exports = router;