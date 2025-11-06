import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  // Local state for profile data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    location: '',
    occupation: '',
    phone: '',
    bio: ''
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize form data with user info
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        location: user.location || '',
        occupation: user.occupation || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
      // Generate unique referral code based on user ID
      setReferralCode(`GHORBARI_${user._id?.slice(-8).toUpperCase()}`);
      // Save user location to localStorage for suggestions
      if (user.location) {
        localStorage.setItem('userLocation', user.location);
      }
    }
  }, [user]);

  // Change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save handler - Update profile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData,
        { headers }
      );

      // Save location to localStorage for Suggestion page
      if (formData.location) {
        localStorage.setItem('userLocation', formData.location);
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditing(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Copy referral code to clipboard
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
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

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="header-content">
          <h1>{user.name}</h1>
          <p className="email">{user.email}</p>
          <span className="role-badge">{user.role?.toUpperCase() || 'USER'}</span>
        </div>
      </div>

      {/* User ID & Referral Section */}
      <div className="referral-section">
        <div className="referral-card">
          <h3>Your Unique ID</h3>
          <p className="user-id">{user._id}</p>
          <p className="id-description">Use this ID for support and inquiries</p>
        </div>

        <div className="referral-card">
          <h3>Referral Code</h3>
          <div className="referral-code-container">
            <code className="referral-code">{referralCode}</code>
            <button 
              onClick={handleCopyReferral} 
              className="copy-btn"
              title="Copy referral code"
            >
              {copySuccess ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <p className="referral-description">Share this code and earn rewards</p>
        </div>
      </div>

      {/* Profile Details / Edit Form */}
      {editing ? (
        <div className="profile-form-container">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSave} className="profile-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="form-input"
              />
              <small>Email cannot be changed</small>
            </div>

            {/* Age */}
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="120"
                className="form-input"
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location (District) *</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">-- Select District --</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
              <small>This location is used for property suggestions</small>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="form-input"
              />
            </div>

            {/* Occupation */}
            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                id="occupation"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Businessman"
                className="form-input"
              />
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="4"
                className="form-input"
              />
            </div>

            {/* Form Buttons */}
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn btn-cancel"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-details-container">
          <h2>Profile Information</h2>
          <div className="profile-details">
            {/* Name */}
            <div className="detail-item">
              <span className="label">Full Name:</span>
              <span className="value">{formData.name}</span>
            </div>

            {/* Email */}
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{formData.email}</span>
            </div>

            {/* Age */}
            <div className="detail-item">
              <span className="label">Age:</span>
              <span className="value">{formData.age || 'Not specified'}</span>
            </div>

            {/* Location */}
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{formData.location || 'Not specified'}</span>
            </div>

            {/* Phone */}
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{formData.phone || 'Not specified'}</span>
            </div>

            {/* Occupation */}
            <div className="detail-item">
              <span className="label">Occupation:</span>
              <span className="value">{formData.occupation || 'Not specified'}</span>
            </div>

            {/* Bio */}
            {formData.bio && (
              <div className="detail-item bio-item">
                <span className="label">Bio:</span>
                <span className="value">{formData.bio}</span>
              </div>
            )}

            {/* Role */}
            <div className="detail-item">
              <span className="label">Account Type:</span>
              <span className="value role">{user.role === 'premium' ? '👑 Premium' : '👤 Regular'}</span>
            </div>

            {/* Joined Date */}
            <div className="detail-item">
              <span className="label">Joined:</span>
              <span className="value">
                {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={() => setEditing(true)} 
            className="btn btn-edit"
          >
            ✏️ Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
