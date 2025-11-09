const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Received:", req.method, req.url);
  next();
});

// ==================== MONGODB CONNECTION ====================
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghorbari')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ==================== ROUTES ====================
// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// User Routes
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// Property Routes
const propertyRoutes = require('./routes/property');
app.use('/api/property', propertyRoutes);
// Alias to support legacy/pluralized endpoints
app.use('/api/properties', propertyRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Contacts Routes
const contactsRoutes = require('./routes/contacts');
app.use('/api/contacts', contactsRoutes);

// Company Routes
const companyRoutes = require('./routes/company');
app.use('/api/company', companyRoutes);

// Technician Routes
const technicianRoutes = require('./routes/technician');
app.use('/api/technician', technicianRoutes);

// FAQ Routes
const faqRoutes = require('./routes/faq');
app.use('/api/faq', require('./routes/faq'));


// Meeting Routes
const meetingRoutes = require('./routes/meeting');
app.use('/api/meeting', meetingRoutes);

// Story Routes
const storyRoutes = require('./routes/story');
app.use('/api/story', require('./routes/story'));


// Payment Routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// ==================== NEW ROUTES (PHASE 5) ====================
// Price Analysis Routes
const priceAnalysisRoutes = require('./routes/priceAnalysis');
app.use('/api/price-analysis', priceAnalysisRoutes);

// Wishlist Routes
const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

// Offer Routes
const offerRoutes = require('./routes/offer');
app.use('/api/offer', offerRoutes);

// Rating Routes
const ratingRoutes = require('./routes/rating');
app.use('/api/rating', ratingRoutes);

// Notifications Routes
const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes);

const suggestionRoutes = require('./routes/suggestion');
app.use('/api/property/suggestions', suggestionRoutes);


// Referral Routes
const referralRoutes = require('./routes/referral');
app.use('/api/referral', referralRoutes);

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
