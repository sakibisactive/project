const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  requestDeletion,
  getAllUsers
} = require('../controllers/userController');

/*
  User profile routes:
  - GET    /profile/me             (get current user profile)
  - PUT    /profile/update         (update: name, age, location, occupation, latitude, longitude)
  - POST   /profile/delete-request
  - GET    /all
*/

router.get('/profile/me', auth, getProfile);
router.put('/profile/update', auth, updateProfile);
router.post('/profile/delete-request', auth, requestDeletion);
router.get('/all', auth, getAllUsers);

module.exports = router;
