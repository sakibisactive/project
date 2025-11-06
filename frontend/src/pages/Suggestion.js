import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Suggestion.css';

const Suggestion = () => {
  const navigate = useNavigate();

  // State
  const [userLocation, setUserLocation] = useState(null);
  const [suggestedProperties, setSuggestedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  // Fetch user's current location and get suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, get user's current location from profile/localStorage
        const storedLocation = localStorage.getItem('userLocation');

        if (!storedLocation) {
          setError('User location not found. Please set your location in profile settings.');
          setLoading(false);
          return;
        }

        setUserLocation(storedLocation);

        // API call: GET /api/property/suggestions?userLocation={location}
        const response = await fetch(
  `/api/property/suggestions/premium`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }
);


        if (!response.ok) {
          throw new Error('Failed to fetch suggested properties');
        }

        const data = await response.json();
        const suggestionsArr = data.properties || [];

        if (suggestionsArr.length === 0) {
          setNoResults(true);
          setSuggestedProperties([]);
        } else {
          // Sort by criteria: price, crime rate, school distance, market distance, hospital distance (all ascending)
          const sorted = suggestionsArr.sort((a, b) => {
            if (a.price !== b.price) return a.price - b.price;
            if (a.crimeRate !== b.crimeRate) return a.crimeRate - b.crimeRate;
            if (a.schoolsDistance !== b.schoolsDistance) return a.schoolsDistance - b.schoolsDistance;
            if (a.marketsDistance !== b.marketsDistance) return a.marketsDistance - b.marketsDistance;
            return a.hospitalsDistance - b.hospitalsDistance;
          });

          setSuggestedProperties(sorted);
          setNoResults(false);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching suggestions');
        console.error('Suggestion Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Handle property click - navigate to details
  const handlePropertyClick = (propertyId) => {
    navigate(`/property-details/${propertyId}`);
  };

  // Handle location update
  const handleUpdateLocation = () => {
    navigate('/profile');
  };

  return (
    <div className="suggestion-container">
      {/* Header Section */}
      <div className="suggestion-header">
        <h1>Personalized Suggestions</h1>
        <p>Properties curated just for you in {userLocation || 'your location'}</p>
      </div>

      {/* Current Location Display */}
      {userLocation && (
        <div className="location-info">
          <p>📍 Showing suggestions for: <strong>{userLocation}</strong></p>
          <small>Change location in <a href="/profile">profile settings</a></small>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>✗ {error}</p>
          <button className="update-location-btn" onClick={handleUpdateLocation}>
            Update Location
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading personalized suggestions...</p>
        </div>
      )}

      {/* No Results Message */}
      {noResults && !loading && (
        <div className="no-results-message">
          <p>No properties found matching your criteria in {userLocation}.</p>
          <p>Try updating your location in profile settings.</p>
          <button className="explore-btn" onClick={() => navigate('/explore')}>
            Explore All Properties
          </button>
        </div>
      )}

      {/* Suggested Properties List */}
      {!loading && !noResults && suggestedProperties.length > 0 && (
        <div className="suggestions-container">
          <div className="suggestions-header">
            <h2>Found {suggestedProperties.length} Properties</h2>
            <p className="criteria-info">✓ Low price ✓ Low crime ✓ Close to schools ✓ Close to hospitals ✓ Close to markets ✓ Public transport available</p>
          </div>

          <div className="properties-list">
            {suggestedProperties.map((property, index) => (
              <div
                key={property._id}
                className="property-card"
                onClick={() => handlePropertyClick(property._id)}
              >
                <div className="card-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>

                <div className="card-header">
                  <h3>{property.propertyType}</h3>
                  <span className="requirement-badge">
                    {property.rentOrSell === 'Rent' ? '🏠 For Rent' : '🏡 For Sale'}
                  </span>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{property.location}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value price">TK {property.price?.toLocaleString()}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Crime Rate:</span>
                    <span className="detail-value crime">
                      {property.crimeRate}%
                      <span className="risk-indicator" style={{
                        backgroundColor: property.crimeRate < 10 ? '#43e97b' : property.crimeRate < 30 ? '#f5d547' : '#f55'
                      }}></span>
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Schools:</span>
                    <span className="detail-value">
  {typeof property.schoolsDistance === 'number'
    ? property.schoolsDistance.toFixed(2) + ' km'
    : 'N/A'}
</span>

                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Hospitals:</span>
                    <span className="detail-value">
  {typeof property.hospitalsDistance === 'number'
    ? property.hospitalsDistance.toFixed(2) + ' km'
    : 'N/A'}
</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Markets:</span>
                    <span className="detail-value">
  {typeof property.marketsDistance === 'number'
    ? property.marketsDistance.toFixed(2) + ' km'
    : 'N/A'}
</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Public Transport:</span>
                    <span className="detail-value">
                      {property.publicTransport ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">
                    View Full Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestion;
