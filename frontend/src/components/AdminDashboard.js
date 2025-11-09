import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [pendingStories, setPendingStories] = useState([]);
  const [pendingMeetings, setPendingMeetings] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    setErrors({});
    // Utility for fetching and setting each data type
    const fetchData = async (url, setter, errorKey, dataKey) => {
      try {
        const response = await axios.get(url);
        setter(response.data?.[dataKey] || []);
      } catch (error) {
        setErrors(prev => ({ ...prev, [errorKey]: `Error loading ${errorKey}` }));
      }
    };

    try {
      await Promise.all([
        fetchData('/api/admin/verifications/pending', setPendingVerifications, 'verifications', 'users'),
        fetchData('/api/admin/deletions/pending', setPendingDeletions, 'deletions', 'users'),
        fetchData('/api/admin/stories/pending', setPendingStories, 'stories', 'stories'),
        fetchData('/api/admin/meetings/pending', setPendingMeetings, 'meetings', 'meetings'),
        fetchData('/api/admin/questions/pending', setPendingQuestions, 'questions', 'questions'),
      ]);
    } catch (error) {
      setErrors(prev => ({ ...prev, general: 'Error loading dashboard data' }));
    } finally {
      setLoadingData(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading admin dashboard...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="error-container">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {loadingData ? (
        <div className="loading-container">
          <div className="loader"></div>
          Loading dashboard data...
        </div>
      ) : errors.general ? (
        <div className="error-message">{errors.general}</div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="stats-card">
              <h3>Pending Verifications</h3>
              <span>{pendingVerifications.length}</span>
              {errors.verifications && <div className="error-text">{errors.verifications}</div>}
              <button
                className="action-button"
                onClick={() => navigate('/admin/verifications')}
                disabled={!!errors.verifications}
              >
                View Details
              </button>
            </div>
            <div className="stats-card">
              <h3>Pending Deletions</h3>
              <span>{pendingDeletions.length}</span>
              {errors.deletions && <div className="error-text">{errors.deletions}</div>}
              <button
                className="action-button"
                onClick={() => navigate('/admin/property-management')}
                disabled={!!errors.deletions}
              >
                Properties
              </button>
            </div>
            <div className="stats-card">
              <h3>Pending Stories</h3>
              <span>{pendingStories.length}</span>
              {errors.stories && <div className="error-text">{errors.stories}</div>}
              <button
                className="action-button"
                onClick={() => navigate('/admin/stories')}
                disabled={!!errors.stories}
              >
                Review Stories
              </button>
            </div>
            <div className="stats-card">
              <h3>Pending Meetings</h3>
              <span>{pendingMeetings.length}</span>
              {errors.meetings && <div className="error-text">{errors.meetings}</div>}
              <button
                className="action-button"
                onClick={() => navigate('/admin/meetings')}
                disabled={!!errors.meetings}
              >
                View Meetings
              </button>
            </div>
            <div className="stats-card">
              <h3>Pending Questions</h3>
              <span>{pendingQuestions.length}</span>
              {errors.questions && <div className="error-text">{errors.questions}</div>}
              <button
                className="action-button"
                onClick={() => navigate('/admin/questions')}
                disabled={!!errors.questions}
              >
                Manage FAQ
              </button>
            </div>
          </div>
        </>
      )}

      

      
    </div>
  );
};

export default AdminDashboard;
