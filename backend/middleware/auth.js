const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('REQ HEADER', req.headers.authorization);
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }
    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded id and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Token verification failed, authorization denied' });
    }

    // Attach user object to request
    req.user = user;

    // Proceed to next middleware/controller
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;
