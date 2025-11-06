import React, { useState } from 'react';
import './Advertise.css';

// 64 Districts of Bangladesh (alphabetically sorted)
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

const PROPERTY_TYPES = ['Plot', 'Apartment', 'Building'];
const RENT_SELL_OPTIONS = ['Rent', 'Sell'];
const TRANSPORT_OPTIONS = ['Yes', 'No'];

const Advertise = () => {
  // State for all form fields
  const [formData, setFormData] = useState({
    propertyType: '',
    rentOrSell: '',
    propertyDetails: '',
    location: '',
    price: '',
    crimeRate: '',
    schoolsDistance: '',
    hospitalsDistance: '',
    marketsDistance: '',
    publicTransport: '',
    contactInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.rentOrSell) newErrors.rentOrSell = 'Please select Rent or Sell';
    if (!formData.propertyDetails.trim()) newErrors.propertyDetails = 'Property details are required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.crimeRate || isNaN(formData.crimeRate) || formData.crimeRate < 0 || formData.crimeRate > 100) {
      newErrors.crimeRate = 'Crime rate must be between 0-100%';
    }
    if (!formData.schoolsDistance || isNaN(formData.schoolsDistance) || formData.schoolsDistance < 0) {
      newErrors.schoolsDistance = 'Valid distance in km is required';
    }
    if (!formData.hospitalsDistance || isNaN(formData.hospitalsDistance) || formData.hospitalsDistance < 0) {
      newErrors.hospitalsDistance = 'Valid distance in km is required';
    }
    if (!formData.marketsDistance || isNaN(formData.marketsDistance) || formData.marketsDistance < 0) {
      newErrors.marketsDistance = 'Valid distance in km is required';
    }
    if (!formData.publicTransport) newErrors.publicTransport = 'Public transport availability is required';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact info is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validate form
    if (!validateForm()) {
      setErrorMessage('Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // API call to POST /api/property/advertise
      const response = await fetch('/api/property/advertise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyType: formData.propertyType,
          rentOrSell: formData.rentOrSell,
          propertyDetails: formData.propertyDetails,
          location: formData.location,
          price: parseFloat(formData.price),
          crimeRate: parseFloat(formData.crimeRate),
          schoolsDistance: parseFloat(formData.schoolsDistance),
          hospitalsDistance: parseFloat(formData.hospitalsDistance),
          marketsDistance: parseFloat(formData.marketsDistance),
          publicTransport: formData.publicTransport === 'Yes',
          contactInfo: formData.contactInfo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to advertise property');
      }

      const data = await response.json();

      // Success message
      setSuccessMessage('Property advertised successfully! Your property has been listed.');
      
      // Reset form after successful submission
      setFormData({
        propertyType: '',
        rentOrSell: '',
        propertyDetails: '',
        location: '',
        price: '',
        crimeRate: '',
        schoolsDistance: '',
        hospitalsDistance: '',
        marketsDistance: '',
        publicTransport: '',
        contactInfo: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while advertising the property');
      console.error('Advertise Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advertise-container">
      <div className="advertise-header">
        <h1>Advertise Your Property</h1>
        <p>List your property for rent or sale on GHORBARI</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p>✓ {successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message">
          <p>✗ {errorMessage}</p>
        </div>
      )}

      {/* Advertise Form */}
      <div className="advertise-form-container">
        <form onSubmit={handleSubmit} className="advertise-form">
          
          {/* Row 1: Property Type & Rent/Sell */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Property Type *</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className={`form-input ${errors.propertyType ? 'input-error' : ''}`}
              >
                <option value="">-- Select Property Type --</option>
                {PROPERTY_TYPES.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.propertyType && <span className="error-text">{errors.propertyType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rentOrSell">Rent or Sell *</label>
              <select
                id="rentOrSell"
                name="rentOrSell"
                value={formData.rentOrSell}
                onChange={handleInputChange}
                className={`form-input ${errors.rentOrSell ? 'input-error' : ''}`}
              >
                <option value="">-- Select Option --</option>
                {RENT_SELL_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.rentOrSell && <span className="error-text">{errors.rentOrSell}</span>}
            </div>
          </div>

          {/* Row 2: Property Details */}
          <div className="form-group full-width">
            <label htmlFor="propertyDetails">Property Details *</label>
            <textarea
              id="propertyDetails"
              name="propertyDetails"
              value={formData.propertyDetails}
              onChange={handleInputChange}
              placeholder="Describe your property in detail..."
              className={`form-input ${errors.propertyDetails ? 'input-error' : ''}`}
              rows="4"
            />
            {errors.propertyDetails && <span className="error-text">{errors.propertyDetails}</span>}
          </div>

          {/* Row 3: Location & Price */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`form-input ${errors.location ? 'input-error' : ''}`}
              >
                <option value="">-- Select District --</option>
                {DISTRICTS.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (TK) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                min="0"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
          </div>

          {/* Row 4: Crime Rate */}
          <div className="form-group full-width">
            <label htmlFor="crimeRate">Crime Rate (0-100%) *</label>
            <input
              type="number"
              id="crimeRate"
              name="crimeRate"
              value={formData.crimeRate}
              onChange={handleInputChange}
              placeholder="Enter crime rate percentage"
              className={`form-input ${errors.crimeRate ? 'input-error' : ''}`}
              min="0"
              max="100"
            />
            {errors.crimeRate && <span className="error-text">{errors.crimeRate}</span>}
          </div>

          {/* Row 5: Distance Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolsDistance">Schools Distance (km) *</label>
              <input
                type="number"
                id="schoolsDistance"
                name="schoolsDistance"
                value={formData.schoolsDistance}
                onChange={handleInputChange}
                placeholder="Distance in km"
                className={`form-input ${errors.schoolsDistance ? 'input-error' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.schoolsDistance && <span className="error-text">{errors.schoolsDistance}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="hospitalsDistance">Hospitals Distance (km) *</label>
              <input
                type="number"
                id="hospitalsDistance"
                name="hospitalsDistance"
                value={formData.hospitalsDistance}
                onChange={handleInputChange}
                placeholder="Distance in km"
                className={`form-input ${errors.hospitalsDistance ? 'input-error' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.hospitalsDistance && <span className="error-text">{errors.hospitalsDistance}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="marketsDistance">Markets Distance (km) *</label>
              <input
                type="number"
                id="marketsDistance"
                name="marketsDistance"
                value={formData.marketsDistance}
                onChange={handleInputChange}
                placeholder="Distance in km"
                className={`form-input ${errors.marketsDistance ? 'input-error' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.marketsDistance && <span className="error-text">{errors.marketsDistance}</span>}
            </div>
          </div>

          {/* Row 6: Public Transport & Contact Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publicTransport">Public Transport Available *</label>
              <select
                id="publicTransport"
                name="publicTransport"
                value={formData.publicTransport}
                onChange={handleInputChange}
                className={`form-input ${errors.publicTransport ? 'input-error' : ''}`}
              >
                <option value="">-- Select --</option>
                {TRANSPORT_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.publicTransport && <span className="error-text">{errors.publicTransport}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactInfo">Contact Info (Phone/Email) *</label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Your phone or email"
                className={`form-input ${errors.contactInfo ? 'input-error' : ''}`}
              />
              {errors.contactInfo && <span className="error-text">{errors.contactInfo}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit & Advertise Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Advertise;
