import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './AdminStories.css';

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/admin/pending-stories');
      setStories(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching stories');
      setLoading(false);
    }
  };

  const handleStory = async (storyId, approved) => {
    try {
      await axios.post('/api/admin/handle-story', { storyId, approved });
      fetchStories(); // Refresh the list
    } catch (error) {
      setError('Error processing story');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-stories">
      <h2>Story Approvals</h2>
      <div className="stories-list">
        {stories.length === 0 ? (
          <p>No pending stories</p>
        ) : (
          stories.map(story => (
            <div key={story._id} className="story-card">
              <div className="story-info">
                <h3>By: {story.userId.name}</h3>
                <p>Title: {story.title}</p>
                <p>Posted on: {new Date(story.createdAt).toLocaleDateString()}</p>
                <div className="story-content">
                  <p>{story.content}</p>
                </div>
              </div>
              <div className="story-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleStory(story._id, true)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStory(story._id, false)}
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

export default AdminStories;