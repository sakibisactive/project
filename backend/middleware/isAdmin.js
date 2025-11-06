// isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied, not an admin." });
  }
  next();
};
module.exports = isAdmin;
