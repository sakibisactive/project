import React, { useState, useEffect } from 'react';
import './Technicians.css';

// Profession types
const PROFESSIONS = ['Plumber', 'Electrician', 'Sanitary'];

const Technicians = () => {
  // State
  const [workersList, setWorkersList] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meetRequestSent, setMeetRequestSent] = useState(false);
  const [meetLoading, setMeetLoading] = useState(false);

  // Fetch workers on component load or when profession changes
  useEffect(() => {
    fetchWorkers();
  }, []);

  // Fetch workers from backend
  const fetchWorkers = async (profession = '') => {
    setLoading(true);
    setError(null);

    try {
      // API call: GET /api/technician/all or with profession filter
      let url = 'http://localhost:5001/api/contacts/technicians';

// Optionally handle filter:
if (profession) {
  url += `?profession=${profession}`;
}


      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }

      const data = await response.json();
setWorkersList(data.technicians || []);


      if (data.length === 0) {
        setError('No technicians found');
      }

    } catch (err) {
      setError(err.message || 'An error occurred while fetching technicians');
      console.error('Fetch Technicians Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profession filter change
  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    fetchWorkers(profession);
    setShowDetails(false);
    setSelectedWorker(null);
  };

  // Clear profession filter
  const handleClearFilter = () => {
    setSelectedProfession('');
    fetchWorkers('');
  };

  // Handle worker card click - show details
  const handleWorkerClick = (worker) => {
    setSelectedWorker(worker);
    setShowDetails(true);
    setMeetRequestSent(false);
  };

  // Handle back button - hide details
  const handleBack = () => {
    setShowDetails(false);
    setSelectedWorker(null);
  };

  // Handle MEET button click - send meeting request to admin
  const handleMeetRequest = async () => {
    if (!selectedWorker) return;

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
          workerId: selectedWorker._id,
          workerName: selectedWorker.name,
          workerType: 'Technician',
          profession: selectedWorker.profession,
          message: `${currentUserName} wants to meet ${selectedWorker.name} (${selectedWorker.profession})`
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
      <div className="technicians-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading technicians...</p>
        </div>
      </div>
    );
  }

  // Show details view
  if (showDetails && selectedWorker) {
    return (
      <div className="technicians-container">
        <button onClick={handleBack} className="back-btn">← Back</button>

        <div className="worker-details-container">
          <div className="worker-header">
            <div className="worker-avatar">
              {selectedWorker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{selectedWorker.name}</h1>
              <span className="profession-badge">{selectedWorker.profession}</span>
            </div>
          </div>

          <div className="worker-info-grid">
            {/* Profession */}
            <div className="info-card">
              <div className="info-icon">🔧</div>
              <div className="info-content">
                <h3>Profession</h3>
                <p className="info-value">{selectedWorker.profession}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="info-card">
              <div className="info-icon">📅</div>
              <div className="info-content">
                <h3>Years of Experience</h3>
                <p className="info-value">{selectedWorker.experience || 'N/A'} years</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h3>Contact Information</h3>
                <p className="info-value">{selectedWorker.contactInfo || 'N/A'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h3>Location</h3>
                <p className="info-value">{selectedWorker.location || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          {selectedWorker.rating && (
            <div className="worker-rating">
              <h2>Rating</h2>
              <div className="stars">
                {'⭐'.repeat(Math.floor(selectedWorker.rating))}
              </div>
              <p className="rating-value">{selectedWorker.rating.toFixed(1)} / 5.0</p>
            </div>
          )}

          {/* Description/About */}
          {selectedWorker.description && (
            <div className="worker-description">
              <h2>About</h2>
              <p>{selectedWorker.description}</p>
            </div>
          )}

          {/* Skills */}
          {selectedWorker.skills && selectedWorker.skills.length > 0 && (
            <div className="worker-skills">
              <h2>Skills</h2>
              <div className="skills-list">
                {selectedWorker.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
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

  // Workers list view
  return (
    <div className="technicians-container">
      <div className="technicians-header">
        <h1>Find Skilled Technicians</h1>
        <p>Connect with plumbers, electricians, and sanitary workers</p>
      </div>

      {/* Profession Filter Buttons */}
      <div className="profession-filters">
        <button 
          className={`filter-btn ${selectedProfession === '' ? 'active' : ''}`}
          onClick={handleClearFilter}
        >
          All Professions
        </button>
        {PROFESSIONS.map((profession) => (
          <button
            key={profession}
            className={`filter-btn ${selectedProfession === profession ? 'active' : ''}`}
            onClick={() => handleProfessionChange(profession)}
          >
            {profession}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>✗ {error}</p>
          <button onClick={() => fetchWorkers(selectedProfession)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Workers Grid */}
      {workersList.length > 0 && (
        <div className="workers-grid">
          {workersList.map((worker) => (
            <div
              key={worker._id}
              className="worker-card"
              onClick={() => handleWorkerClick(worker)}
            >
              <div className="card-avatar">
                {worker.name.charAt(0).toUpperCase()}
              </div>
              <div className="card-content">
                <h3>{worker.name}</h3>
                <p className="card-profession">
                  <span className="profession-label">{worker.profession}</span>
                </p>
                <p className="card-experience">
                  📅 {worker.experience || 0} years experience
                </p>
                {worker.location && (
                  <p className="card-location">📍 {worker.location}</p>
                )}
                {worker.rating && (
                  <p className="card-rating">
                    ⭐ {worker.rating.toFixed(1)} / 5.0
                  </p>
                )}
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && workersList.length === 0 && (
        <div className="no-results-message">
          <p>No technicians found</p>
        </div>
      )}
    </div>
  );
};

export default Technicians;
