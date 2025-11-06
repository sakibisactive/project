import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  
  // State for property and user actions
  const [property, setProperty] = useState(null);
  const [rating, setRating] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch property on component load
  useEffect(() => {
    fetchProperty();
    checkWishlistStatus();
  }, [id]);

  // Fetch property details
  const fetchProperty = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:5000/api/property/${id}`, { headers });
      setProperty(response.data.property);
    } catch (error) {
      setError('Error fetching property details');
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if property is in wishlist
  const checkWishlistStatus = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:5000/api/wishlist/check/${id}`, { headers });
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  // Handle RATE button - Submit rating
  const handleSubmitRating = async () => {
    if (!rating) {
      alert('Please select a rating');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // If rating is 0, notify admin
      if (parseInt(rating) === 0) {
        await axios.post(
          'http://localhost:5000/api/admin/notification',
          {
            type: 'low_rating',
            propertyId: id,
            userId: user._id,
            userName: user.name,
            rating: rating,
            message: `${user.name} gave a 0 rating to property ${id}`
          },
          { headers }
        );
      }

      // Submit rating
      await axios.post(
        `http://localhost:5000/api/properties/${id}/rate`,
        { rating: parseInt(rating) },
        { headers }
      );

      setSuccessMessage('Rating submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setRating('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  // Handle WISHLIST button
  const handleWishlist = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (isWishlisted) {
        // Remove from wishlist
        await axios.post(
          'http://localhost:5000/api/wishlist/remove',
          { propertyId: id },
          { headers }
        );
        setIsWishlisted(false);
        setSuccessMessage('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(
          'http://localhost:5000/api/wishlist/add',
          { propertyId: id },
          { headers }
        );
        setIsWishlisted(true);
        setSuccessMessage('Added to wishlist');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist');
    }
  };

  // Handle MEET button - Send meeting request
  const handleMeetRequest = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        'http://localhost:5000/api/meeting/request',
        {
          userId: user._id,
          userName: user.name,
          propertyId: id,
          ownerId: property.ownerId,
          ownerName: property.ownerName,
          message: `${user.name} wants to meet ${property.ownerName} who is the owner of property ${id}`
        },
        { headers }
      );

      setSuccessMessage('Meeting request sent! Admin will contact you soon.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error requesting meeting:', error);
      alert('Failed to send meeting request');
    }
  };

  // Handle OFFER PRICE - Submit offer
  const handleSubmitOffer = async () => {
    if (!offerPrice || isNaN(offerPrice) || offerPrice <= 0) {
      alert('Please enter a valid offer price');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `http://localhost:5000/api/property/${id}/offer`,
        {
          userId: user._id,
          userName: user.name,
          offerPrice: parseFloat(offerPrice),
          originalPrice: property.price
        },
        { headers }
      );

      setSuccessMessage(`Offer of TK ${offerPrice} submitted! Property owner will be notified.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setOfferPrice('');
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Failed to submit offer');
    }
  };

  // Image navigation for 360° view
  const handleNextImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="property-details">
        <div className="loading">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-details">
        <div className="error">{error || 'Property not found'}</div>
      </div>
    );
  }

  const isPremium = user && user.role === 'premium';

  return (
    <div className="property-details">
      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p>✓ {successMessage}</p>
        </div>
      )}

      {/* Property Header */}
      <div className="property-header">
        <h2>Property ID: {property._id}</h2>
        <span className="property-type">{property.propertyType}</span>
        <span className="requirement-badge">
          {property.rentOrSell === 'Rent' ? '🏠 For Rent' : '🏡 For Sale'}
        </span>
      </div>

      <div className="property-content">
        {/* Images Section - 360° viewer */}
        <div className="property-images">
          <div className="image-viewer">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  alt={`Property view ${currentImageIndex + 1}`}
                  className="main-image"
                />
                {property.images.length > 1 && (
                  <div className="image-controls">
                    <button onClick={handlePrevImage} className="nav-btn prev-btn">
                      ←
                    </button>
                    <span className="image-counter">
                      {currentImageIndex + 1} / {property.images.length}
                    </span>
                    <button onClick={handleNextImage} className="nav-btn next-btn">
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          {/* Virtual Tour Link */}
          {property.virtualTour && (
            <a href={property.virtualTour} target="_blank" rel="noopener noreferrer" className="virtual-tour-link">
              📷 View Virtual Tour 360°
            </a>
          )}
        </div>

          {/* Property Information */}
        <div className="property-info">
          {/* Basic Info */}
          <div className="info-section">
            <h3>Location: {property.location}</h3>
            <h3 className="price">TK {property.price?.toLocaleString()}</h3>
              {isPremium && (
                <p className="description">{property.description}</p>
              )}
          </div>

          {/* Details Grid */}
          {isPremium && (
            <div className="details-grid">
              {property.crimeRate !== undefined && (
                <div className="detail-item">
                  <span className="label">Crime Rate:</span>
                  <span className="value">{property.crimeRate}%</span>
                </div>
              )}
              {property.schoolsDistance !== undefined && (
                <div className="detail-item">
                  <span className="label">Schools Distance:</span>
                  <span className="value">{property.schoolsDistance} km</span>
                </div>
              )}
              {property.hospitalsDistance !== undefined && (
                <div className="detail-item">
                  <span className="label">Hospitals Distance:</span>
                  <span className="value">{property.hospitalsDistance} km</span>
                </div>
              )}
              {property.marketsDistance !== undefined && (
                <div className="detail-item">
                  <span className="label">Markets Distance:</span>
                  <span className="value">{property.marketsDistance} km</span>
                </div>
              )}
              {property.publicTransport !== undefined && (
                <div className="detail-item">
                  <span className="label">Public Transport:</span>
                  <span className="value">{property.publicTransport ? '✓ Yes' : '✗ No'}</span>
                </div>
              )}
            </div>
          )}

          {/* Owner Information */}
          <div className="owner-info">
            <h4>Owner Information</h4>
            {isPremium ? (
              <>
                <p>Name: {property.ownerName}</p>
                <p>Contact: {property.ownerContact}</p>
                <p>Email: {property.ownerEmail}</p>
              </>
            ) : (
              <p className="premium-notice">
                <em>🔒 Upgrade to Premium to see the owner's identity and contact details</em>
              </p>
            )}
          </div>

          {/* Rating Display */}
          <div className="property-rating">
            <h4>
              ⭐ {property.rating?.toFixed(1) || 'N/A'} / 5.0
              ({property.ratingCount || 0} ratings)
            </h4>
          </div>

          {/* OFFER PRICE Section (Premium Only) */}
          {isPremium && (
            <div className="offer-section">
              <h4>Make an Offer</h4>
              <div className="offer-input-group">
                <input
                  type="number"
                  placeholder="Enter your offer price (TK)"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  min="0"
                  className="offer-input"
                />
                <button onClick={handleSubmitOffer} className="btn btn-offer">
                  Submit Offer
                </button>
              </div>
            </div>
          )}

          {/* RATE Section */}
          <div className="rate-section">
            <h4>Rate This Property</h4>
            <div className="rating-input-group">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rating-select"
              >
                <option value="">Select Rating (0-5)</option>
                <option value="0">0 - Poor</option>
                <option value="1">1 - Bad</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
              <button onClick={handleSubmitRating} className="btn btn-rate">
                Submit Rating
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {/* WISHLIST Button */}
            <button
              onClick={handleWishlist}
              className={`btn btn-wishlist ${isWishlisted ? 'active' : ''}`}
            >
              {isWishlisted ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </button>

            {/* MEET Button (Premium Only) */}
            {isPremium && (
              <button onClick={handleMeetRequest} className="btn btn-meet">
                🤝 MEET
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
