const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getCompanies,
  getCompany,
  rateCompany,
  getDevelopers,
  getInteriorDesigners,
  getLegalServices,
  getMovingServices
} = require('../controllers/companyController');

// Main generic routes
router.get('/', auth, getCompanies);
router.get('/:id', auth, getCompany);
router.post('/:id/rate', auth, rateCompany);

// Specific routes for company types -- ADD THESE
router.get('/developers', auth, getDevelopers);
router.get('/interior', auth, getInteriorDesigners);
router.get('/legal', auth, getLegalServices);
router.get('/moving', auth, getMovingServices);

module.exports = router;
