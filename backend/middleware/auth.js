const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Log full request details
    console.log('Auth Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      cookies: req.cookies
    });

    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header missing or invalid');
      return res.status(401).json({ 
        error: 'No authentication token, access denied',
        details: 'Please ensure you are logged in and have a valid token'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Processing token:', token.substring(0, 20) + '...');

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-256-bit-secret';
    console.log('Using JWT secret:', JWT_SECRET.substring(0, 5) + '...');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', { id: decoded.id, role: decoded.role });

    // Find user and include role information
    const user = await User.findById(decoded.id)
      .select('-password')
      .lean(); // Use lean() for better performance

    if (!user) {
      console.log('User not found for token:', decoded.id);
      return res.status(401).json({ 
        error: 'Token verification failed, authorization denied',
        details: 'User account not found'
      });
    }

    console.log('User authenticated:', { 
      id: user._id,
      role: user.role,
      verified: user.verified
    });

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
