import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PremiumDashboard.css';
import { FaCompass, FaAddressBook, FaLightbulb, FaChartLine, FaHeart, FaBell, FaCrown, FaBookmark } from 'react-icons/fa';

const PremiumDashboard = () => {
  const navigate = useNavigate();

  // Premium features section data (kept for reference or optional display)
  const premiumFeatures = [
    { label: "Priority property alerts", action: "View Alerts", link: "/alerts" },
    { label: "Advanced analytics & statistics", action: "See Analytics", link: "/analytics" },
    { label: "Personalized property suggestions", action: "My Suggestions", link: "/suggestions" },
    { label: "Direct contact with property owners", action: "Contact Owners", link: "/contact-owners" }
  ];

  return (
    <div className="premium-dashboard">
      <div className="premium-header">
        <h2>WELCOME</h2>
      </div>

      

      {/* NEW: 5 BIG BUTTONS AT CENTER */}
      <div className="dashboard-buttons-container">
        <button 
          className="big-button" 
          onClick={() => navigate('/explore')}
          title="Explore properties"
        >
          <FaCompass className="btn-icon" />
          <span>Explore</span>
        </button>
        
        <button 
          className="big-button" 
          onClick={() => navigate('/contacts')}
          title="Contact service providers"
        >
          <FaAddressBook className="btn-icon" />
          <span>Contacts</span>
        </button>
        
        <button 
          className="big-button" 
          onClick={() => navigate('/suggestion')}
          title="Get personalized suggestions"
        >
          <FaLightbulb className="btn-icon" />
          <span>Suggestion</span>
        </button>
        
        <button 
          className="big-button" 
          onClick={() => navigate('/price-analysis')}
          title="Analyze property prices"
        >
          <FaChartLine className="btn-icon" />
          <span>Analysis</span>
        </button>
        
        
      </div>

      {null}
    </div>
  );
};

export default PremiumDashboard;
