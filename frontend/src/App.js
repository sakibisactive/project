import React, { useState, useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

// Context Providers
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components & Pages
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PropertySearch from './components/PropertySearch';
import Notifications from './components/Notifications';
import AdminDashboard from './components/AdminDashboard';
import AdminVerifications from './pages/AdminVerifications';
import AdminPremiumMembers from './pages/AdminPremiumMembers';
import AdminStories from './pages/AdminStories';
import AdminMeetings from './pages/AdminMeetings';
import AdminQuestions from './pages/AdminQuestions';
import AdminPropertyManagement from './pages/AdminPropertyManagement';
import PaymentPage from './components/Payment';
import PropertyDetails from './pages/PropertyDetails';
import Advertise from './pages/Advertise';
import PriceAnalysis from './pages/PriceAnalysis';
import Explore from './pages/Explore';
import Suggestion from './pages/Suggestion';
import Contacts from './pages/Contacts';
import Developers from './pages/Developers';
import InteriorDesigners from './pages/InteriorDesigners';
import LegalServices from './pages/LegalServices';
import MovingServices from './pages/MovingServices';
import Technicians from './pages/Technicians';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Stories from './pages/Stories';
import Wishlist from './pages/Wishlist';
import RentalProperties from './pages/RentalProperties';
import Upgrade from './pages/Upgrade';

import './App.css';

// Enhanced Private Route
function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '18px', fontWeight: '600', color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

// Main App Routes
function AppRoutes({ darkMode }) {
  const { user } = useContext(AuthContext);


  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Admin routes */}
      <Route path="/admin" element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/verifications" element={
        <PrivateRoute role="admin">
          <AdminVerifications />
        </PrivateRoute>
      } />
      <Route path="/admin/premium-members" element={
        <PrivateRoute role="admin">
          <AdminPremiumMembers />
        </PrivateRoute>
      } />
      <Route path="/admin/property-management" element={
        <PrivateRoute role="admin">
          <AdminPropertyManagement />
        </PrivateRoute>
      } />
      <Route path="/admin/stories" element={
        <PrivateRoute role="admin">
          <AdminStories />
        </PrivateRoute>
      } />
      <Route path="/admin/meetings" element={
        <PrivateRoute role="admin">
          <AdminMeetings />
        </PrivateRoute>
      } />
      <Route path="/admin/questions" element={
        <PrivateRoute role="admin">
          <AdminQuestions />
        </PrivateRoute>
      } />
      <Route path="/payment" element={
        <PrivateRoute>
          <PaymentPage darkMode={darkMode} />
        </PrivateRoute>
      } />
      <Route path="/property" element={
        <PrivateRoute>
          <PropertyDetails />
        </PrivateRoute>
      } />
      <Route path="/property/:id" element={
        <PrivateRoute>
          <PropertyDetails />
        </PrivateRoute>
      } />
      {/* Standard Auth routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/upgrade" element={
        <PrivateRoute>
          <Upgrade />
        </PrivateRoute>
      } />
      <Route path="/property-search" element={
        <PrivateRoute>
          <PropertySearch />
        </PrivateRoute>
      } />
      <Route path="/property/:id" element={
        <PrivateRoute>
          <PropertyDetails />
        </PrivateRoute>
      } />
      <Route path="/property-details/:id" element={
        <PrivateRoute>
          <PropertyDetails />
        </PrivateRoute>
      } />
      <Route path="/explore" element={
        <PrivateRoute>
          <Explore />
        </PrivateRoute>
      } />
      <Route path="/suggestion" element={
        <PrivateRoute>
          <Suggestion />
        </PrivateRoute>
      } />
      <Route path="/wishlist" element={
        <PrivateRoute>
          <Wishlist />
        </PrivateRoute>
      } />
      <Route path="/payment" element={
  <PrivateRoute>
    <PaymentPage darkMode={darkMode} />
  </PrivateRoute>
} />


      {/* Service routes */}
      <Route path="/contacts" element={
        <PrivateRoute>
          <Contacts />
        </PrivateRoute>
      } />
      <Route path="/contacts/developers" element={
        <PrivateRoute>
          <Developers />
        </PrivateRoute>
      } />
      <Route path="/contacts/interior" element={
        <PrivateRoute>
          <InteriorDesigners />
        </PrivateRoute>
      } />
      <Route path="/contacts/legal" element={
        <PrivateRoute>
          <LegalServices />
        </PrivateRoute>
      } />
      <Route path="/contacts/moving" element={
        <PrivateRoute>
          <MovingServices />
        </PrivateRoute>
      } />
      <Route path="/contacts/technicians" element={
        <PrivateRoute>
          <Technicians />
        </PrivateRoute>
      } />

      {/* Profile & user routes */}
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/stories" element={
        <PrivateRoute>
          <Stories />
        </PrivateRoute>
      } />
      <Route path="/story" element={
        <PrivateRoute>
          <Stories />
        </PrivateRoute>
      } />
      <Route path="/faq" element={
        <PrivateRoute>
          <FAQ />
        </PrivateRoute>
      } />
      <Route path="/notifications" element={
        <PrivateRoute>
          <Notifications />
        </PrivateRoute>
      } />
      <Route path="/rentals" element={
        <PrivateRoute>
          <RentalProperties />
        </PrivateRoute>
      } />

      {/* Premium-only routes */}
      <Route path="/advertise" element={
        <PrivateRoute role="premium">
          <Advertise />
        </PrivateRoute>
      } />
      <Route path="/advertise-property" element={
        <PrivateRoute role="premium">
          <Advertise />
        </PrivateRoute>
      } />
      <Route path="/price-analysis" element={
        <PrivateRoute role="premium">
          <PriceAnalysis />
        </PrivateRoute>
      } />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

// Shell that conditionally renders the Navbar based on current route
function AppLayout({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const hideNavbar = location.pathname === '/' && !user;

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      { !hideNavbar && (
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <AppRoutes darkMode={darkMode} />
    </div>
  );
}

// Main App
function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(v => !v);
  };

  useEffect(() => {
    const cls = 'dark-mode';
    if (darkMode) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
