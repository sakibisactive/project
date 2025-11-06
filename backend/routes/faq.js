const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createFAQ,
  getAllFAQs,
  getPendingFAQs,
  answerFAQ
} = require('../controllers/faqController');

router.post('/', auth, createFAQ);
router.get('/all', auth, getAllFAQs); // This will match your frontend's fetch URL!

router.get('/pending/all', auth, roleCheck('admin'), getPendingFAQs);
router.post('/:id/answer', auth, roleCheck('admin'), answerFAQ);

module.exports = router;