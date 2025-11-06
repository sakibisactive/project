import React, { useState, useEffect } from 'react';
import './InteriorDesigners.css';

const InteriorDesigners = () => {
  // State: companiesList, selectedCompany, showDetails
  const [companiesList, setCompaniesList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetRequestSent, setMeetRequestSent] = useState(false);
  const [meetLoading, setMeetLoading] = useState(false);

  // Fetch companies on component load
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch interior design companies from backend
  const fetchCompanies = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:5000/api/contacts/interior', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch interior design companies');
    }

    const data = await response.json();
    setCompaniesList(data.designers || []);
    if ((data.designers || []).length === 0) {
      setError('No interior design companies found');
    }

  } catch (err) {
    setError(err.message || 'An error occurred while fetching companies');
    console.error('Fetch Companies Error:', err);
  } finally {
    setLoading(false);
  }
};


  // Handle company card click - show details
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setShowDetails(true);
    setMeetRequestSent(false);
  };

  // Handle back button - hide details
  const handleBack = () => {
    setShowDetails(false);
    setSelectedCompany(null);
  };

  // Handle MEET button click - send meeting request to admin
  const handleMeetRequest = async () => {
    if (!selectedCompany) return;

    setMeetLoading(true);

    try {
      // Get current user info from localStorage
      const currentUserId = localStorage.getItem('userId');
      const currentUserName = localStorage.getItem('userName');

      // API call: POST /api/meeting/request
      const response = await fetch('/api/meeting/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: currentUserId,
          userName: currentUserName,
          companyId: selectedCompany._id,
          companyName: selectedCompany.name,
          companyType: 'Interior Design',
          message: `${currentUserName} wants to meet ${selectedCompany.name} company`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send meeting request');
      }

      setMeetRequestSent(true);

      // Show success message for 3 seconds then clear
      setTimeout(() => {
        setMeetRequestSent(false);
      }, 3000);

    } catch (err) {
      console.error('Meet Request Error:', err);
      alert('Failed to send meeting request');
    } finally {
      setMeetLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="interior-designers-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading interior design companies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && companiesList.length === 0) {
    return (
      <div className="interior-designers-container">
        <div className="error-container">
          <p>✗ {error}</p>
          <button onClick={fetchCompanies} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show details view
  if (showDetails && selectedCompany) {
    return (
      <div className="interior-designers-container">
        <button onClick={handleBack} className="back-btn">← Back</button>

        <div className="company-details-container">
          <div className="company-header">
            <h1>{selectedCompany.name}</h1>
            <span className="company-type">Interior Design Company</span>
          </div>

          <div className="company-info-grid">
            {/* Flats Designed */}
            <div className="info-card">
              <div className="info-icon">🏠</div>
              <div className="info-content">
                <h3>Flats Designed</h3>
                <p className="info-value">{selectedCompany.flatsDesigned || 'N/A'}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h3>Contact Information</h3>
                <p className="info-value">{selectedCompany.contactInfo || 'N/A'}</p>
              </div>
            </div>

            {/* Office Location */}
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h3>Office Location</h3>
                <p className="info-value">{selectedCompany.officeLocation || 'N/A'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <h3>Email</h3>
                <p className="info-value">{selectedCompany.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {selectedCompany.description && (
            <div className="company-description">
              <h2>About</h2>
              <p>{selectedCompany.description}</p>
            </div>
          )}

          {/* Services */}
          {selectedCompany.services && (
            <div className="company-services">
              <h2>Services Offered</h2>
              <div className="services-list">
                {selectedCompany.services.map((service, idx) => (
                  <span key={idx} className="service-tag">
                    ✓ {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meet Request Success Message */}
          {meetRequestSent && (
            <div className="success-message">
              ✓ Meeting request sent successfully! Admin will contact you soon.
            </div>
          )}

          {/* MEET Button */}
          <button
            onClick={handleMeetRequest}
            className="meet-btn"
            disabled={meetLoading || meetRequestSent}
          >
            {meetLoading ? 'Sending Request...' : meetRequestSent ? '✓ Request Sent' : 'MEET'}
          </button>
        </div>
      </div>
    );
  }

  // Companies list view
  return (
    <div className="interior-designers-container">
      <div className="interior-designers-header">
        <h1>Interior Design Companies</h1>
        <p>Find and connect with professional interior designers</p>
      </div>

      <div className="companies-grid">
        {companiesList.map((company) => (
          <div
            key={company._id}
            className="company-card"
            onClick={() => handleCompanyClick(company)}
          >
            <div className="card-icon">🎨</div>
            <div className="card-content">
              <h3>{company.name}</h3>
              <p className="card-location">📍 {company.officeLocation}</p>
              <p className="card-contact">📞 {company.contactInfo}</p>
              <p className="card-flats">🏠 {company.flatsDesigned} Flats Designed</p>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorDesigners;
