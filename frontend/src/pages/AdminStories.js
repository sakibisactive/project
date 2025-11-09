import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './AdminStories.css';

const AdminStories = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStories();
  }, [user, navigate]);

  const fetchStories = async () => {
    try {
      setLoadingStories(true);
      setError(null);
      const response = await axios.get('/api/admin/stories/pending');
      setStories(response.data.stories || []);
    } catch (err) {
      setError('Error fetching stories. Please try again later.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleStory = async (storyId, action) => {
    try {
      await axios.post(`/api/admin/stories/${storyId}/handle`, { action });
      // Remove the handled story from the list
      setStories(stories.filter(story => story._id !== storyId));
    } catch (err) {
      setError('Error processing story. Please try again.');
      console.error('Error handling story:', err);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="error-container">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="admin-stories">
      <h1>Story Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loadingStories ? (
        <div className="loading-container">Loading stories...</div>
      ) : stories.length === 0 ? (
        <div className="no-stories">No pending stories to review.</div>
      ) : (
        <div className="stories-grid">
          {stories.map(story => (
            <div key={story._id} className="story-card">
              <div className="story-header">
                <h3>{story.title}</h3>
                <span className="author">By: {story.author?.name || 'Anonymous'}</span>
              </div>
              
              <div className="story-content">
                <p>{story.content}</p>
                {story.images?.length > 0 && (
                  <div className="story-images">
                    {story.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Story image ${index + 1}`}
                        className="story-image"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="story-info">
                <p>Category: {story.category}</p>
                <p>Submitted: {new Date(story.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="story-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleStory(story._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStory(story._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/admin')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default AdminStories;