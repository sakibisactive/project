import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './RentalProperties.css';

const RentalProperties = () => {
  const { token, user } = useContext(AuthContext);
  const [rentals, setRentals] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    priceSort: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    rentPrice: '',
    floorNumber: '',
    flatsPerFloor: '',
    roomsPerFlat: '',
    ownerName: user?.name || '',
    ownerContact: '',
    ownerEmail: user?.email || '',
    description: ''
  });

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/rentals', { headers });
      setRentals(response.data.rentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5000/api/rentals', formData, { headers });
      alert('Rental property advertised successfully!');
      setFormData({
        propertyType: '',
        location: '',
        rentPrice: '',
        floorNumber: '',
        flatsPerFloor: '',
        roomsPerFlat: '',
        ownerName: '',
        ownerContact: '',
        ownerEmail: '',
        description: ''
      });
      setShowForm(false);
      fetchRentals();
    } catch (error) {
      console.error('Error advertising rental:', error);
    }
  };

  return (
    <div className="rentals-page">
      <h2>Rental Properties</h2>

      {user.role === 'premium' && (
        <div className="advertise-section">
          <button className="btn-advertise" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Advertise Property for Rent'}
          </button>
{showForm && (
            <form onSubmit={handleSubmit} className="rental-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="PLOT">Plot</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="BUILDING">Building</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rent Price (TK/month)</label>
                  <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Floor Number</label>
                  <input type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} />
                </div>
              </div>
<div className="form-row">
                <div className="form-group">
                  <label>Flats per Floor</label>
                  <input type="number" name="flatsPerFloor" value={formData.flatsPerFloor} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Rooms per Flat</label>
                  <input type="number" name="roomsPerFlat" value={formData.roomsPerFlat} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
              </div>

              <button type="submit">ADVERTISE</button>
            </form>
          )}
        </div>
      )}
<div className="rentals-list">
        <h3>Available Rentals</h3>
        {rentals.length === 0 ? (
          <p>No rental properties available</p>
        ) : (
          rentals.map(rental => (
            <div key={rental._id} className="rental-card">
              <h4>{rental.propertyType} in {rental.location}</h4>
              <p>Rent: {rental.rentPrice} TK/month</p>
              <p>Floor: {rental.floorNumber} | Flats/Floor: {rental.flatsPerFloor} | Rooms: {rental.roomsPerFlat}</p>
              <p>{rental.description}</p>
              <p>Owner: {rental.ownerName}</p>
              {user.role === 'premium' && (
                <>
                  <p>Contact: {rental.ownerContact}</p>
                  <p>Email: {rental.ownerEmail}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RentalProperties;
