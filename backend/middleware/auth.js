const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Headers:', req.headers);
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token);

    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-256-bit-secret');
    console.log('Decoded token:', decoded);

    // Find user by decoded id and exclude password
    const user = await User.findById(decoded.id).select('-password');
    console.log('Found user:', user ? 'User exists' : 'No user found');
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
