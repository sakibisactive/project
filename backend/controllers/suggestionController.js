const Property = require('../models/Property');
const User = require('../models/User');
const School = require('../models/School');
const Hospital = require('../models/Hospital');
const Market = require('../models/Market');

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getPremiumSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.latitude == null || user.longitude == null) {
      return res.status(400).json({ success: false, message: 'User location not set.' });
    }

    const [schools, hospitals, markets, properties] = await Promise.all([
      School.find(),
      Hospital.find(),
      Market.find(),
      Property.find({ status: 'available' })
    ]);

    const propList = properties.map(property => {
      const userPropertyDistance = haversineDistance(
        property.latitude, property.longitude,
        user.latitude, user.longitude
      );
      const schoolsDistance = Math.min(...schools.map(
  s => haversineDistance(property.latitude, property.longitude, s.latitude, s.longitude)
));

      const hospitalsDistance = Math.min(...hospitals.map(h =>
        haversineDistance(property.latitude, property.longitude, h.latitude, h.longitude)
      ));
      const marketsDistance = Math.min(...markets.map(m =>
        haversineDistance(property.latitude, property.longitude, m.latitude, m.longitude)
      ));

      return {
        ...property.toObject(),
        userPropertyDistance,
        schoolsDistance,
        hospitalsDistance,
        marketsDistance
      };
    });

    propList.sort((a, b) => {
      if (a.userPropertyDistance !== b.userPropertyDistance)
        return a.userPropertyDistance - b.userPropertyDistance;
      if (a.schoolsDistance !== b.schoolsDistance)
        return a.schoolsDistance - b.schoolsDistance;
      if (a.hospitalsDistance !== b.hospitalsDistance)
        return a.hospitalsDistance - b.hospitalsDistance;
      if (a.marketsDistance !== b.marketsDistance)
        return a.marketsDistance - b.marketsDistance;
      if (a.price !== b.price)
        return a.price - b.price;
      return 0;
    });

    res.json({ success: true, properties: propList });
  } catch (err) {
    console.error('Premium Suggestion Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
