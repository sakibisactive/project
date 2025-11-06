import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

// Constants for filter options
const PROPERTY_TYPES = ['Plot', 'Apartment', 'Building'];
const REQUIREMENTS = ['Rent', 'Buy'];
const DISTRICTS = [
  'Barisal', 'Bagerhat', 'Bhola', 'Jhalokati', 'Pirojpur',
  'Chittagong', 'Chandpur', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Rangamati',
  'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Jamuna', 'Manikganj', 'Narayanganj', 'Narsingdi', 'Shariatpur', 'Tangail',
  'Khulna', 'Bagerhat', 'Jessore', 'Khulna', 'Satkhira',
  'Mymensingh', 'Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur',
  'Rajshahi', 'Bogra', 'Joypurhat', 'Natore', 'Naogaon', 'Pabna', 'Rajshahi', 'Sirajganj',
  'Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon',
  'Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'
].sort();
const PRICE_FILTERS = ['Low to High', 'High to Low'];
const DATE_FILTERS = ['Old to New', 'New to Old'];

const Explore = () => {
  const navigate = useNavigate();

  // State for all 5 filter values
  const [filters, setFilters] = useState({
    propertyType: '',
    requirement: '',
    location: '',
    price: '',
    date: ''
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Search button: Fetch filtered properties
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    setNoResults(false);

    try {
      // Build query string from filters
      console.log('token used for search:', localStorage.getItem('token'));
      const queryParams = new URLSearchParams();
      
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
      if (filters.requirement) queryParams.append('requirement', filters.requirement);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.price) queryParams.append('price', filters.price);
      if (filters.date) queryParams.append('date', filters.date);

      // API call to GET /api/property/search?filters
      const response = await fetch(
        `/api/property/search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
const propertyArr = data.properties || [];

if (propertyArr.length === 0) {
  setNoResults(true);
  setFilteredProperties([]);
} else {
  setFilteredProperties(propertyArr);
  setNoResults(false);
}


    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      console.error('Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Click property button to go to PropertyDetails
  const handlePropertyClick = (propertyId) => {
    navigate(`/property-details/${propertyId}`);
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      propertyType: '',
      requirement: '',
      location: '',
      price: '',
      date: ''
    });
    setProperties([]);
    setFilteredProperties([]);
    setSearched(false);
    setNoResults(false);
    setError(null);
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Explore Properties</h1>
        <p>Find your perfect property with our advanced filters</p>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <form onSubmit={handleSearch} className="filters-form">
          <div className="filters-row">
            
            {/* Property Type Filter */}
            <div className="filter-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Requirement Filter */}
            <div className="filter-group">
              <label htmlFor="requirement">Requirement</label>
              <select
                id="requirement"
                name="requirement"
                value={filters.requirement}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All</option>
                {REQUIREMENTS.map((req, idx) => (
                  <option key={idx} value={req}>
                    {req}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Districts</option>
                {DISTRICTS.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <label htmlFor="price">Price</label>
              <select
                id="price"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Prices</option>
                {PRICE_FILTERS.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="filter-group">
              <label htmlFor="date">Date</label>
              <select
                id="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Dates</option>
                {DATE_FILTERS.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="buttons-row">
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>✗ {error}</p>
        </div>
      )}

      {/* Results Section */}
      {searched && (
        <div className="results-section">
          
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Searching for properties...</p>
            </div>
          )}

          {/* No Results Message */}
          {noResults && !loading && (
            <div className="no-results-message">
              <p>No properties found matching your criteria.</p>
              <p>Try adjusting your filters.</p>
            </div>
          )}

          {/* Properties List */}
          {!noResults && !loading && filteredProperties.length > 0 && (
            <div className="properties-container">
              <h2>Found {filteredProperties.length} Properties</h2>
              <div className="properties-grid">
                {filteredProperties.map((property) => (
                  <button
                    key={property._id || property.propId}

                    className="property-button"
                    onClick={() => handlePropertyClick(property._id)}
                    title={`Click to view details of property ${property._id}`}
                  >
                    <div className="property-id">
                      <span className="label">Property ID:</span>
                      <span className="id">{property._id}</span>
                    </div>
                    <div className="property-info">
                      <span className="type">{property.propertyType}</span>
                      <span className="location">{property.location}</span>
                    </div>
                    <div className="property-price">
                      <span>TK {property.price?.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State Message */}
      {!searched && (
        <div className="initial-message">
          <p>Use the filters above to search for properties</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
