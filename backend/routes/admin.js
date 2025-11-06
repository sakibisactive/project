const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  approveDeletion,
  getPendingStories,
  getPremiumMembers,
  getAdminStats,
  getAdminLogs
} = require('../controllers/adminController');

// Verification endpoints
router.get('/verifications/pending', auth, roleCheck('admin'), getPendingVerifications);
router.post('/verifications/:id/approve', auth, roleCheck('admin'), approveVerification);
router.post('/verifications/:id/reject', auth, roleCheck('admin'), rejectVerification);

// Deletion endpoints
router.post('/users/:id/delete-approve', auth, roleCheck('admin'), approveDeletion);

// Story endpoints
router.get('/stories/pending', auth, roleCheck('admin'), getPendingStories);

// Premium members
router.get('/premium-members', auth, roleCheck('admin'), getPremiumMembers);

// Statistics
router.get('/stats', auth, roleCheck('admin'), getAdminStats);
router.get('/logs', auth, roleCheck('admin'), getAdminLogs);

module.exports = router;