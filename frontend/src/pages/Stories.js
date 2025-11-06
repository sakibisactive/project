import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Stories.css';

// Story Card Component
const StoryCard = ({ story, isUserStory }) => (
  <div className={`story-card ${story.status}`}>
    <div className={`status-badge ${story.status}`}>
      {story.status === 'pending' ? '⏳ Pending Approval' : '✓ Approved'}
    </div>
    <div className="story-header">
      <h3>{story.title}</h3>
      <span className="author">👤 {story.userName}</span>
      <span className="date">📅 {new Date(story.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="property-info">
      <span>🏠 {story.propertyTitle}</span>
      <span>ID: {story.propertyId?.slice(0, 12)}...</span>
    </div>
    <div className="story-content">
      <p>{story.content.substring(0, 150)}...</p>
    </div>
    {story.images && story.images.length > 0 && (
      <div className="story-images">
        {story.images.slice(0, 3).map((img, idx) => (
          <img key={idx} src={img} alt={`Story ${idx}`} />
        ))}
        {story.images.length > 3 && (
          <span className="more-images">+{story.images.length - 3}</span>
        )}
      </div>
    )}
    <div className="story-footer">
      <span>❤️ {story.likes || 0} Likes</span>
      <span>💬 {story.comments?.length || 0} Comments</span>
      <a href={`/story/${story._id}`} className="read-more">Read More →</a>
    </div>
  </div>
);

const Stories = () => {
  const { token, user } = useContext(AuthContext);

  // States
  const [allStories, setAllStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submittingStory, setSubmittingStory] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    propertyTitle: '',
    title: '',
    content: '',
    images: []
  });

  // Fetch data
  useEffect(() => {
    fetchAllStories();
    if (user) fetchUserStories();
  }, [user]);

  const fetchAllStories = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.get('/api/story', { headers: { Authorization: `Bearer ${token}` } });
      setAllStories(data.stories || []);
    } catch {
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStories = async () => {
    try {
      const { data } = await axios.get(
        `/api/stories/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserStories(data.stories || []);
    } catch {
      // Do not show error, non-premium users don't need.
    }
  };

  // Form handlers
  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    for (let file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', 'ghorbari');
      try {
        const res = await axios.post('/api/upload/image', fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        newImages.push(res.data.imageUrl);
      } catch {
        setError('Image upload failed');
      }
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = idx => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  // Submit Story
  const handleSubmitStory = async (e) => {
    e.preventDefault(); setError(''); setSuccessMessage('');
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmittingStory(true);
    try {
      const storyData = {
        ...formData,
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      };
      await axios.post(
        '/api/story',
        storyData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('✓ Your story has been submitted! Waiting for admin approval.');
      setFormData({ propertyId: '', propertyTitle: '', title: '', content: '', images: [] });
      setShowForm(false);
      setTimeout(() => {
        fetchUserStories();
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit story');
    } finally {
      setSubmittingStory(false);
    }
  };

  const isPremium = user?.role === 'premium';

  return (
    <div className="stories-container">
      <header className="stories-header">
        <h1>📖 Success Stories</h1>
        <p>Read inspiring stories from our community</p>
      </header>
      {successMessage && <div className="success-message"><p>{successMessage}</p></div>}
      {error && <div className="error-message"><p>✗ {error}</p></div>}

      {isPremium && (
        <section className="write-story-section">
          <button
            className={`btn-write-story ${showForm ? 'active' : ''}`}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? '✕ Cancel' : '✏️ Write Your Story'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmitStory} className="story-form">
              <h2>Share Your Success Story</h2>
              <p className="form-subtitle">Tell us about your property experience</p>

              <input
                id="propertyId"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                placeholder="Property ID"
                required
                className="form-input"
              />
              <input
                id="propertyTitle"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={handleChange}
                placeholder="Property Title"
                required
                className="form-input"
              />
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Story Title"
                required
                className="form-input"
              />
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Your Story"
                required
                rows={6}
                className="form-input"
              />
              <div className="form-group">
                <label htmlFor="images">Add Images (Optional)</label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
                {formData.images.length > 0 && (
                  <div className="image-preview">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img} alt={`Preview ${idx}`} />
                        <button type="button" className="remove-btn" onClick={() => removeImage(idx)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-submit-story" disabled={submittingStory}>
                {submittingStory ? 'Submitting...' : '📤 Submit Story'}
              </button>
            </form>
          )}
        </section>
      )}

      <div className="stories-tabs">
        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}>
          All Stories ({allStories.length})
        </button>
        {isPremium && (
          <button className={`tab-btn ${activeTab === 'my-stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-stories')}>
            My Stories ({userStories.length})
          </button>
        )}
      </div>

      <div className="stories-grid">
        {loading ? (
          <div className="loading">Loading stories...</div>
        ) : activeTab === 'all' ? (
          allStories.length === 0 ? (
            <div className="no-stories">
              <p>📚 No stories available yet</p>
              <p className="subtitle">Be the first to share your success story!</p>
            </div>
          ) : (
            allStories.map(story => <StoryCard key={story._id} story={story} />)
          )
        ) : (
          userStories.length === 0 ? (
            <div className="no-stories">
              <p>📝 You haven't shared any stories yet</p>
              <p className="subtitle">Share your first success story and inspire others!</p>
            </div>
          ) : (
            userStories.map(story => (
              <StoryCard key={story._id} story={story} isUserStory />
            ))
          )
        )}
      </div>
    </div>
  );
};
export default Stories;
