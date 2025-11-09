import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './AdminVerifications.css';

const AdminVerifications = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const response = await axios.get('/api/admin/verifications/pending');
      setPendingVerifications(response.data.users);

      setLoading(false);
    } catch (error) {
      setError('Error fetching verification requests');
      setLoading(false);
    }
  };

  const handleVerification = async (userId, approved) => {
    try {
      await axios.post('/api/admin/verify-user', { userId, approved });
      fetchPendingVerifications(); // Refresh the list
    } catch (error) {
      setError('Error processing verification request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-verifications">
      <h2>Pending Verification Requests</h2>
      <div className="verification-list">
        {pendingVerifications.length === 0 ? (
          <p>No pending verification requests</p>
        ) : (
          pendingVerifications.map(user => (
            <div key={user._id} className="verification-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Requested on: {new Date(user.premiumRequest.requestedAt).toLocaleDateString()}</p>
              </div>
              <div className="verification-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleVerification(user._id, true)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleVerification(user._id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminVerifications;