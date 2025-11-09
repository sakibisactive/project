import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Wishlist.css';

const Wishlist = ({ darkMode }) => {
  const { user, token } = useContext(AuthContext);
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlist(response.data.wishlist || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (propertyId) => {
    try {
      await axios.post(
        'http://localhost:5001/api/wishlist/remove',
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setWishlist(wishlist.filter(p => p._id !== propertyId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  if (loading) {
    return <div className={`wishlist-container ${darkMode ? 'dark' : ''}`}>{t('loading')}</div>;
  }

  return (
    <div className={`wishlist-container ${darkMode ? 'dark' : ''}`}>
      <div className="wishlist-header">
        <h1>{t('myWishlist')}</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <h2>❤️ {t('emptyWishlist')}</h2>
          <p>Start adding properties to your wishlist!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(property => (
            <div key={property._id} className="wishlist-card">
              <div className="property-image">
                <img 
                  src={property.images?.[0] || 'https://via.placeholder.com/300x200?text=Property'} 
                  alt={property.propertyTitle}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Property';
                  }}
                />
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(property._id)}
                  title="Remove from wishlist"
                >
                  ❤️
                </button>
              </div>

              <div className="property-info">
                <h3>{property.propertyTitle || 'Property'}</h3>
                
                <div className="property-details">
                  <span className="badge">{property.propertyType}</span>
                  <span className="badge">{property.rentOrSell}</span>
                </div>

                <div className="property-location">
                  📍 {property.location}
                </div>

                <div className="property-price">
                  <strong>TK {property.price?.toLocaleString() || 'N/A'}</strong>
                </div>

                <div className="property-stats">
                  <div className="stat">
                    <span>🏫 Schools:</span>
                    <span>{property.schoolsDistance || 'N/A'} km</span>
                  </div>
                  <div className="stat">
                    <span>🏥 Hospitals:</span>
                    <span>{property.hospitalsDistance || 'N/A'} km</span>
                  </div>
                  <div className="stat">
                    <span>🛒 Markets:</span>
                    <span>{property.marketsDistance || 'N/A'} km</span>
                  </div>
                </div>

                <div className="crime-rate">
                  ⚠️ Crime Rate: <strong>{property.crimeRate || 'N/A'}%</strong>
                </div>

                <div className="action-buttons">
                  <button className="btn-view">View Details</button>
                  <button 
                    className="btn-remove"
                    onClick={() => removeFromWishlist(property._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
