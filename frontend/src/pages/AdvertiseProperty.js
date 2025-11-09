import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdvertiseProperty.css';

const AdvertiseProperty = () => {
  const { token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    price: '',
    ownerName: user?.name || '',
    ownerContact: '',
    ownerEmail: user?.email || '',
    description: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5001/api/properties', formData, { headers });
      alert('Property advertised successfully!');
      setFormData({
        propertyType: '',
        location: '',
        price: '',
        ownerName: '',
        ownerContact: '',
        ownerEmail: '',
        description: '',
        images: []
      });
    } catch (error) {
      console.error('Error advertising property:', error);
      alert('Failed to advertise property');
    }
  };

  return (
    <div className="advertise-property">
      <h2>Advertise Your Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Type</label>
          <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="PLOT">Plot</option>
            <option value="APARTMENT">Apartment</option>
            <option value="BUILDING">Building</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Price (TK)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input type="tel" name="ownerContact" value={formData.ownerContact} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-submit">Advertise Property</button>
      </form>
    </div>
  );
};

export default AdvertiseProperty;
