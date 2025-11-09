import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './AdminMeetings.css';

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/admin/pending-meetings');
      setMeetings(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching meetings');
      setLoading(false);
    }
  };

  const handleMeeting = async (meetingId, approved) => {
    try {
      await axios.post('/api/admin/handle-meeting', { meetingId, approved });
      fetchMeetings(); // Refresh the list
    } catch (error) {
      setError('Error processing meeting request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-meetings">
      <h2>Meeting Requests</h2>
      <div className="meetings-list">
        {meetings.length === 0 ? (
          <p>No pending meeting requests</p>
        ) : (
          meetings.map(meeting => (
            <div key={meeting._id} className="meeting-card">
              <div className="meeting-info">
                <h3>Request from: {meeting.userId.name}</h3>
                <p>Property: {meeting.propertyId.location}</p>
                <p>Owner: {meeting.propertyId.ownerName}</p>
                <p>Requested on: {new Date(meeting.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="meeting-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleMeeting(meeting._id, true)}
                >
                  Approve & Share Contact
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleMeeting(meeting._id, false)}
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

export default AdminMeetings;