import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5001/api/notifications', { headers });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:5001/api/notifications/${notifId}/read`, {}, { headers });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (notifId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5001/api/notifications/${notifId}`, { headers });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div key={notif._id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              <div className="notif-content">
                <p><strong>{notif.type.toUpperCase()}</strong></p>
                <p>{notif.message}</p>
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
              </div>
              <div className="notif-actions">
                {!notif.read && (
                  <button onClick={() => handleMarkAsRead(notif._id)}>Mark as Read</button>
                )}
                <button onClick={() => handleDelete(notif._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;