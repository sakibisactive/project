const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTechnicians,
  getTechnician,
  rateTechnician
} = require('../controllers/technicianController');

router.get('/', auth, getTechnicians);
router.get('/:id', auth, getTechnician);
router.post('/:id/rate', auth, rateTechnician);

module.exports = router;