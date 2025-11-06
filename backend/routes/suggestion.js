const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPremiumSuggestions } = require('../controllers/suggestionController');

router.get('/premium', auth, getPremiumSuggestions);

module.exports = router;
