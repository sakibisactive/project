const Rental = require('../models/Rental');

exports.getRentals = async (req, res) => {
  try {
    const { propertyType, location, priceSort } = req.query;

    let query = { status: 'available' };

    if (propertyType) query.propertyType = propertyType;
    if (location) query.location = location;

    let sort = {};
    if (priceSort) {
      sort.rentPrice = priceSort === 'low-to-high' ? 1 : -1;
    }

    const rentals = await Rental.find(query).sort(sort);
    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    // Hide owner contact for non-premium users
    if (req.user.role === 'non-premium') {
      rental.ownerContact = undefined;
      rental.ownerEmail = undefined;
    }

    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRental = async (req, res) => {
  try {
    if (req.user.role !== 'premium') {
      return res.status(403).json({ error: 'Only premium members can advertise rentals' });
    }

    const {
      propertyType,
      location,
      rentPrice,
      floorNumber,
      flatsPerFloor,
      roomsPerFlat,
      ownerName,
      ownerContact,
      ownerEmail,
      description,
      images
    } = req.body;

    const count = await Rental.countDocuments();
    const rentalId = `RENT${String(count + 1).padStart(3, '0')}`;

    const rental = await Rental.create({
      _id: rentalId,
      propertyType,
      location,
      rentPrice,
      floorNumber,
      flatsPerFloor,
      roomsPerFlat,
      ownerName,
      ownerContact,
      ownerEmail,
      description,
      images: images || [],
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRental = async (req, res) => {
  try {
    let rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    if (rental.createdBy !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    rental = await Rental.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    if (rental.createdBy !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await rental.deleteOne();
    res.json({ success: true, message: 'Rental deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
