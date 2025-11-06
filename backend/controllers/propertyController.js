const Property = require('../models/Property');
const Notification = require('../models/Notification');

// Get all properties with filtering
exports.getProperties = async (req, res) => {
  try {
    console.log('Frontend Query:', req.query);
    const { propertyType, location, priceSort, dateSort, requirement  } = req.query;

    let query = { status: 'available' };

    if (propertyType) query.propertyType = propertyType;
    if (location) query.location = location;
    if (requirement) {
      // Convert frontend value to backend value if necessary — maybe map "BUY" to "sell" or "Buy"
      query.option = new RegExp('^' + requirement + '$', 'i');
    }
    console.log('MongoDB Query:', query);
    let sort = {};
    if (priceSort) {
      sort.price = priceSort === 'low-to-high' ? 1 : -1;
    }
    if (dateSort) {
      sort.createdAt = dateSort === 'old-to-new' ? 1 : -1;
    }

    const properties = await Property.find(query).sort(sort);
    console.log('Results count:', properties.length, properties.map(p => p._id));
    res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Server error while fetching properties' });
  }
};

// Get single property
exports.getProperty = async (req, res) => {
  console.log('DEBUG property id fetch:', req.params.id);
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Hide owner contact info for non-premium users
    if (req.user.role === 'non-premium') {
      property.ownerContact = undefined;
      property.ownerEmail = undefined;
    }

    res.json({ success: true, property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Server error while fetching property' });
  }
};

// Create property (Premium only)
exports.createProperty = async (req, res) => {
  try {
    const {
      propertyType,
      location,
      price,
      ownerName,
      ownerContact,
      ownerEmail,
      description,
      images,
      virtualTour
    } = req.body;

    // Generate a unique property ID
    const count = await Property.countDocuments();
    const propertyId = `PROP${String(count + 1).padStart(3, '0')}`;

    const property = await Property.create({
      _id: propertyId,
      propertyType,
      location,
      price,
      ownerName,
      ownerContact,
      ownerEmail,
      description,
      images: images || [],
      virtualTour,
      createdBy: req.user._id,
      option:'Rent',
      status: 'available',
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Server error while creating property' });
  }
};

// Rate property (Premium only)
exports.rateProperty = async (req, res) => {
  try {
    const { rating } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Calculate new average rating
    const newRatingCount = (property.ratingCount || 0) + 1;
    const newRating = ((property.rating || 0) * (property.ratingCount || 0) + rating) / newRatingCount;

    property.rating = newRating;
    property.ratingCount = newRatingCount;
    await property.save();

    res.json({ success: true, property });
  } catch (error) {
    console.error('Error rating property:', error);
    res.status(500).json({ error: 'Server error while rating property' });
  }
};

// Get suggestions based on user location (Premium only)
exports.getSuggestions = async (req, res) => {
  try {
    const userLocation = req.user.location;

    const properties = await Property.find({
      location: userLocation,
      status: 'available'
    }).sort({ createdAt: -1 });

    res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Server error while fetching suggestions' });
  }
};

// Delete property (Admin only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Server error while deleting property' });
  }
};
