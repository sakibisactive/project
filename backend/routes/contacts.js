const express = require('express');
const router = express.Router();

const Company = require('../models/Company');      // Make sure this model references the companies collection
const Technician = require('../models/Technician'); // Same for technicians

// GET /api/contacts/developers -- all companies of type 'DEVELOPER'
router.get('/developers', async (req, res) => {
  try {
    const developers = await Company.find({ type: 'DEVELOPER' });
    res.json({ developers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contacts/technicians -- all technicians
router.get('/technicians', async (req, res) => {
  try {
    const filter = {};
    // URL will be /api/contacts/technicians?profession=Plumber
    if (req.query.profession) {
      filter.specialty = req.query.profession;
    }
    const technicians = await Technician.find(filter);
    res.json({ technicians });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/interior', async (req, res) => {
  try {
    const designers = await Company.find({ type: 'INTERIOR' });
    res.json({ designers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/contacts/legal -- all companies of type 'LEGAL'
router.get('/legal', async (req, res) => {
  try {
    const legals = await Company.find({ type: 'LEGAL' });
    res.json({ legals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/contacts/moving -- all companies of type 'MOVING'
router.get('/moving', async (req, res) => {
  try {
    const movers = await Company.find({ type: 'MOVING' });
    res.json({ movers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// You can add more endpoints for interior, legal, etc. here in the same way

module.exports = router;
