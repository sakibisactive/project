import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import './AllStories.css';

const AllStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/api/stories/all');
        setStories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stories. ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (!user || user.role !== 'admin') {
    return <div className="access-denied">Access Denied. Admin privileges required.</div>;
  }

  if (loading) {
    return (
      <div className="stories-loading">
        <div className="loader"></div>
        <p>Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return <div className="stories-error">{error}</div>;
  }

  return (
    <div className="all-stories-container">
      <h1>All User Stories</h1>
      <div className="stories-grid">
        {stories.map((story) => (
          <div key={story._id} className="story-card">
            <div className="story-header">
              <h3>{story.title}</h3>
              <span className="story-date">
                {new Date(story.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="story-author">
              <strong>Author:</strong> {story.author?.name || 'Unknown'}
            </div>
            <p className="story-content">{story.content}</p>
            {story.image && (
              <div className="story-image">
                <img src={story.image} alt="Story" />
              </div>
            )}
            <div className="story-footer">
              <div className="story-status">
                <span className={`status-badge ${story.status.toLowerCase()}`}>
                  {story.status}
                </span>
              </div>
              {story.location && (
                <div className="story-location">
                  📍 {story.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStories;