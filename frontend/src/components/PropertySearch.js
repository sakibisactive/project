import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './PropertySearch.css';

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra",
  "Brahmanbaria", "Chandpur", "Chittagong", "Comilla", "Dhaka", "Dinajpur",
  "Faridpur", "Feni", "Gazipur", "Khulna", "Kishoreganj", "Kurigram",
  "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Mymensingh",
  "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona",
  "Nilphamari", "Noakhali", "Pabna", "Patuakhali", "Rajbari", "Rajshahi",
  "Rangpur", "Satkhira", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
  "Tangail", "Thakurgaon"
];

const PropertySearch = () => {
  const { token, user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    priceSort: '',
    dateSort: ''
  });
  const [properties, setProperties] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const query = new URLSearchParams({
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.location && { location: filters.location }),
        ...(filters.priceSort && { priceSort: filters.priceSort }),
        ...(filters.dateSort && { dateSort: filters.dateSort })
      });

      const response = await axios.get(`http://localhost:5001/api/properties?${query}`, { headers });
      setProperties(response.data.properties || []);
      setSearched(true);
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  return (
    <div className="property-search">
      <h2>Search Properties</h2>

      <div className="search-filters">
        <div className="filter-group">
          <label>Property Type</label>
          <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
            <option value="">Select Type</option>
            <option value="PLOT">Plot</option>
            <option value="APARTMENT">Apartment</option>
            <option value="BUILDING">Building</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select name="location" value={filters.location} onChange={handleFilterChange}>
            <option value="">Select District</option>
            {districts.sort().map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Price</label>
          <select name="priceSort" value={filters.priceSort} onChange={handleFilterChange}>
            <option value="">No Sort</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>

        {user.role === 'premium' && (
          <div className="filter-group">
            <label>Date</label>
            <select name="dateSort" value={filters.dateSort} onChange={handleFilterChange}>
              <option value="">No Sort</option>
              <option value="old-to-new">Old to New</option>
              <option value="new-to-old">New to Old</option>
            </select>
          </div>
        )}

        <button className="search-btn" onClick={handleSearch}>SEARCH</button>
      </div>

      {searched && (
        <div className="properties-list">
          <h3>Results: {properties.length} properties found</h3>
          {properties.length === 0 ? (
            <p>No properties found matching your criteria</p>
          ) : (
            <div className="properties-grid">
              {properties.map(prop => (
                <div key={prop._id} className="property-button">
                  <button onClick={() => window.location.href = `/property/${prop._id}`}>
                    {prop._id}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySearch;
