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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [verifications, deletions, stories, meetings, questions] = await Promise.all([
        axios.get('/api/admin/pending-verifications'),
        axios.get('/api/admin/pending-deletions'),
        axios.get('/api/admin/pending-stories'),
        axios.get('/api/admin/pending-meetings'),
        axios.get('/api/admin/pending-questions')
      ]);

      setPendingVerifications(verifications.data);
      setPendingDeletions(deletions.data);
      setPendingStories(stories.data);
      setPendingMeetings(meetings.data);
      setPendingQuestions(questions.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>Access Denied. You are not an admin.</div>;
  }



  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-stats">
        <div className="stats-card">
          <h3>Pending Verifications</h3>
          <span>{pendingVerifications.length}</span>
        </div>
        <div className="stats-card">
          <h3>Pending Deletions</h3>
          <span>{pendingDeletions.length}</span>
        </div>
        <div className="stats-card">
          <h3>Pending Stories</h3>
          <span>{pendingStories.length}</span>
        </div>
        <div className="stats-card">
          <h3>Pending Meetings</h3>
          <span>{pendingMeetings.length}</span>
        </div>
        <div className="stats-card">
          <h3>Pending Questions</h3>
          <span>{pendingQuestions.length}</span>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={() => navigate('/admin/verifications')}>Verification Requests</button>
        <button onClick={() => navigate('/admin/premium-members')}>Premium Members</button>
        <button onClick={() => navigate('/admin/stories')}>Story Approvals</button>
        <button onClick={() => navigate('/admin/meetings')}>Meeting Requests</button>
        <button onClick={() => navigate('/admin/questions')}>FAQ Management</button>
        <button onClick={() => navigate('/admin/property-management')}>Property Management</button>
      </div>

      <button className="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
