const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// GET /api/notifications -> list current user's notifications
router.get('/', auth, getNotifications);

// PUT /api/notifications/:id/read -> mark a notification as read
router.put('/:id/read', auth, markAsRead);

// DELETE /api/notifications/:id -> delete a notification
router.delete('/:id', auth, deleteNotification);

module.exports = router;



