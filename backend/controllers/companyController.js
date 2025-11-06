const Company = require('../models/Company');

// ==================== Get All Companies (with type filter) ====================
exports.getCompanies = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;

    const companies = await Company.find(query).sort({ rating: -1 });
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Get Single Company By ID ====================
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Rate a Company ====================
exports.rateCompany = async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update and recalculate average rating (optional: track users who rated)
    if (!company.ratingCount) company.ratingCount = 0;
    if (!company.rating) company.rating = 0;

    company.rating = ((company.rating * company.ratingCount) + rating) / (company.ratingCount + 1);
    company.ratingCount += 1;

    await company.save();

    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Developers ====================
exports.getDevelopers = async (req, res) => {
  try {
    const developers = await Company.find({ type: 'developers' }).sort({ rating: -1 });
    res.json({ success: true, companies: developers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Interior Designers ====================
exports.getInteriorDesigners = async (req, res) => {
  try {
    const interior = await Company.find({ type: 'interior' }).sort({ rating: -1 });
    res.json({ success: true, companies: interior });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Legal Services ====================
exports.getLegalServices = async (req, res) => {
  try {
    const legal = await Company.find({ type: 'legal' }).sort({ rating: -1 });
    res.json({ success: true, companies: legal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== Moving Services ====================
exports.getMovingServices = async (req, res) => {
  try {
    const moving = await Company.find({ type: 'moving' }).sort({ rating: -1 });
    res.json({ success: true, companies: moving });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
