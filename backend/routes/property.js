const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Property = require('../models/Property');
const {
  getProperties,
  getProperty,
  createProperty,
  rateProperty,
  getSuggestions,
  deleteProperty
} = require('../controllers/propertyController');

// SEARCH endpoint with robust option filtering and debug output
router.get('/search', auth, async (req, res) => {
  try {
    // Debug: Log incoming query params
    console.log('[SEARCH] Query params:', req.query);

    const filter = { status: 'available' };
    if (req.query.propertyType) filter.propertyType = req.query.propertyType;
    if (req.query.location && req.query.location !== 'All Districts') filter.location = req.query.location;

    // Fix: requirement filter (option) - case-insensitive
    if (req.query.requirement && req.query.requirement !== 'All') {
      filter.option = new RegExp('^' + req.query.requirement + '$', 'i');
    }

    // Sorting
    let sortOption = {};
    // Use req.query.priceSort and req.query.dateSort for consistency with your frontend!
    
    if (req.query.price === 'High to Low' || req.query.priceSort === 'high-to-low') sortOption.price = -1;
    else if (req.query.price === 'Low to High' || req.query.priceSort === 'low-to-high') sortOption.price = 1;

    if (req.query.dateSort === 'new-to-old') sortOption.createdAt = -1;
    else if (req.query.dateSort === 'old-to-new') sortOption.createdAt = 1;

    console.log('[SEARCH] MongoDB query filter:', filter, 'sort:', sortOption);

    let query = Property.find(filter);
    if (Object.keys(sortOption).length > 0) query = query.sort(sortOption);

    const properties = await query.exec();
    console.log('[SEARCH] Results count:', properties.length);

    res.json({ properties });
  } catch (err) {
    console.error('[SEARCH] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Standard property endpoints (unchanged)
router.get('/', auth, getProperties);
router.get('/suggestions', auth, roleCheck('premium'), getSuggestions);
router.get('/:id', auth, getProperty);
// Alternate paths for robustness
router.get('/details/:id', auth, getProperty);
router.post('/', auth, roleCheck('premium'), createProperty);
router.post('/:id/rate', auth, roleCheck('premium'), rateProperty);
router.delete('/:id', auth, roleCheck('admin'), deleteProperty);

module.exports = router;
