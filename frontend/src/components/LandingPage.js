import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <ImageSlider />

      <div className="landing-content">
        <div className="landing-overlay">
          <h2>Find Your Dream Property</h2>
          <p>Discover the best real estate deals in Bangladesh</p>
          <Link to="/register" className="btn-get-started">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
