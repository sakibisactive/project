const Technician = require('../models/Technician');

exports.getTechnicians = async (req, res) => {
  try {
    const { specialty } = req.query;

    let query = {};
    if (specialty) query.specialty = specialty;

    const technicians = await Technician.find(query).sort({ rating: -1 });
    res.json({ success: true, technicians });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    res.json({ success: true, technician });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rateTechnician = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    let technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    res.json({ success: true, technician });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
