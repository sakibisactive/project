import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './AdminPremiumMembers.css';

const AdminPremiumMembers = () => {
  const [premiumMembers, setPremiumMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPremiumMembers();
  }, []);

  const fetchPremiumMembers = async () => {
    try {
      const response = await axios.get('/api/admin/premium-members');
      setPremiumMembers(response.data.premiumMembers || []);
      setLoading(false);
    } catch (error) {
      console.error('Error details:', error);
      setError(error.response?.data?.error || 'Error fetching premium members');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-premium-members">
      <h2>Premium Members</h2>
      {premiumMembers.length === 0 ? (
        <div>
          <p>No premium members found</p>
          {error && (
            <div className="error-details" style={{margin: '20px 0', padding: '10px', backgroundColor: '#ffebee'}}>
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="premium-members-list">
          <div className="member-count" style={{margin: '10px 0', padding: '10px', backgroundColor: '#e8f5e9'}}>
            <p>Total Premium Members: {premiumMembers.length}</p>
          </div>
          {premiumMembers.map(member => (
            <div key={member._id} className="member-card">
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>Email: {member.email}</p>
                <p>Member since: {new Date(member.createdAt).toLocaleDateString()}</p>
                <p>Status: <span className="verified-badge">{member.verified ? 'Verified' : 'Pending'}</span></p>
                <p>Role: {member.role}</p>
              </div>
              <div className="member-stats">
                <div className="stat">
                  <span>Properties</span>
                  <strong>{member.properties?.length || 0}</strong>
                </div>
                <div className="stat">
                  <span>Stories</span>
                  <strong>{member.stories?.length || 0}</strong>
                </div>
                <div className="stat">
                  <span>Meetings</span>
                  <strong>{member.meetings?.length || 0}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPremiumMembers;