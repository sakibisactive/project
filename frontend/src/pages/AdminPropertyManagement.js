import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './AdminPropertyManagement.css';

const AdminPropertyManagement = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProperties();
  }, [user, navigate]);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      setError(null);
      const response = await axios.get('/api/property');
      setProperties(response.data.properties || []);
    } catch (err) {
      setError('Error fetching properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handlePropertyDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/properties/${propertyId}`);
      setProperties(properties.filter(prop => prop._id !== propertyId));
    } catch (err) {
      setError('Error deleting property. Please try again.');
      console.error('Error deleting property:', err);
    }
  };

  const handlePropertyVerify = async (propertyId) => {
    try {
      await axios.post(`/api/admin/properties/${propertyId}/verify`);
      setProperties(properties.map(prop => 
        prop._id === propertyId ? { ...prop, verified: true } : prop
      ));
    } catch (err) {
      setError('Error verifying property. Please try again.');
      console.error('Error verifying property:', err);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="error-container">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="admin-property-management">
      <h1>Property Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loadingProperties ? (
        <div className="loading-container">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="no-properties">No properties found.</div>
      ) : (
        <div className="properties-grid">
          {properties.map(property => (
            <div key={property._id} className="property-card">
              <div className="property-header">
                <h3>{property.title}</h3>
                <span className={`status ${property.verified ? 'verified' : 'unverified'}`}>
                  {property.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              
              {property.images?.length > 0 && (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="property-image"
                />
              )}

              <div className="property-details">
                <p><strong>Location:</strong> {property.location}</p>
                <p><strong>Price:</strong> ৳{property.price}</p>
                <p><strong>Type:</strong> {property.propertyType}</p>
                <p><strong>Owner:</strong> {property.owner?.name || 'Unknown'}</p>
              </div>

              <div className="property-actions">
                {!property.verified && (
                  <button
                    className="verify-btn"
                    onClick={() => handlePropertyVerify(property._id)}
                  >
                    Verify Property
                  </button>
                )}
                <button
                  className="view-btn"
                  onClick={() => navigate(`/property/${property._id}`)}
                >
                  View Details
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handlePropertyDelete(property._id)}
                >
                  Delete Property
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/admin')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default AdminPropertyManagement;