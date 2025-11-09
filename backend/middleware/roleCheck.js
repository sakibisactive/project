const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
      console.log('Role Check:', {
        url: req.url,
        method: req.method,
        userRole: req.user?.role,
        allowedRoles,
        user: req.user ? {
          id: req.user._id,
          role: req.user.role,
          verified: req.user.verified
        } : null
      });

      if (!req.user) {
        console.log('Role Check Failed: No user found in request');
        return res.status(401).json({ 
          error: 'Authentication required',
          details: 'Please log in to access this resource'
        });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        console.log(`Role Check Failed: User role '${req.user.role}' not in allowed roles:`, allowedRoles);
        return res.status(403).json({
          error: `Access denied. Required role${allowedRoles.length > 1 ? 's' : ''}: ${allowedRoles.join(' or ')}`,
          details: `Your role (${req.user.role}) does not have sufficient permissions`
        });
      }
  
      console.log('Role Check Passed:', {
        user: req.user._id,
        role: req.user.role,
        endpoint: req.url
      });
      next();
    };
  };
  
  module.exports = roleCheck;
  