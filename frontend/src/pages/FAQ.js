import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FAQBox from '../components/FAQBox';
import './FAQ.css';

const FAQ = () => {
  const { token, user } = useContext(AuthContext);

  // State
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [questionForm, setQuestionForm] = useState({
    question: '',
    category: 'general',
    description: ''
  });
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Categories
  const CATEGORIES = [
    { value: 'general', label: '📋 General' },
    { value: 'payment', label: '💳 Payment' },
    { value: 'account', label: '👤 Account' },
    { value: 'properties', label: '🏠 Properties' },
    { value: 'premium', label: '👑 Premium' },
    { value: 'technical', label: '🔧 Technical' },
    { value: 'other', label: '❓ Other' }
  ];

  // Fetch FAQs on component load
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5001/api/faq/all', { headers });
      setFaqs(response.data.faqs || []);
    } catch (err) {
      setError('Failed to load FAQs');
      setFaqs(getMockFAQs());
    } finally {
      setLoading(false);
    }
  };

  // Mock FAQs (fallback)
  const getMockFAQs = () => [
    {
      _id: '1',
      question: 'How do I create an account?',
      answer: 'Click on Sign Up, fill in your details, and verify your email. Your account will be ready to use immediately!',
      category: 'account',
      views: 234,
      helpful: 89
    },
    {
      _id: '2',
      question: 'What are the benefits of premium membership?',
      answer: 'Premium members get access to owner contact info, can make offers, rate properties, advertise properties, and get priority support.',
      category: 'premium',
      views: 456,
      helpful: 198
    },
    {
      _id: '3',
      question: 'How do I list a property?',
      answer: 'Go to Advertise page, fill in property details including location, price, images, and crime rate. Submit for admin review.',
      category: 'properties',
      views: 321,
      helpful: 145
    },
    {
      _id: '4',
      question: 'What payment methods are accepted?',
      answer: 'We accept bKash, Nagad, and Rocket for premium membership payments. All transactions are secure and encrypted.',
      category: 'payment',
      views: 567,
      helpful: 234
    },
    {
      _id: '5',
      question: 'How can I use a referral code?',
      answer: 'During premium checkout, enter your referral code to get 500 TK discount. Make sure the code is valid before applying.',
      category: 'payment',
      views: 289,
      helpful: 123
    },
    {
      _id: '6',
      question: 'Can I cancel my premium membership?',
      answer: 'Yes, you can cancel anytime from Account Settings. No refunds for partial months, but you can reactivate later.',
      category: 'premium',
      views: 345,
      helpful: 156
    },
    {
      _id: '7',
      question: 'How do property suggestions work?',
      answer: 'Set your location in profile. We then suggest properties with low price, low crime, close to schools/hospitals/markets.',
      category: 'properties',
      views: 412,
      helpful: 187
    },
    {
      _id: '8',
      question: 'Is my data secure?',
      answer: 'Yes, all data is encrypted with SSL. We follow strict privacy policies and never share your information without consent.',
      category: 'technical',
      views: 298,
      helpful: 167
    }
  ];

  // FAQ Interactions
  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!questionForm.question.trim()) {
      setError('Please enter your question');
      return;
    }
    setSubmittingQuestion(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        'http://localhost:5001/api/faq/submit',
        {
          userId: user._id,
          userName: user.name,
          email: user.email,
          question: questionForm.question,
          description: questionForm.description,
          category: questionForm.category
        },
        { headers }
      );
      setSuccessMessage('Thank you! Your question has been submitted. Our team will respond soon.');
      setQuestionForm({ question: '', category: 'general', description: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleHelpful = async (faqId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `http://localhost:5001/api/faq/${faqId}/helpful`,
        {},
        { headers }
      );
      setFaqs(faqs.map(faq =>
        faq._id === faqId
          ? { ...faq, helpful: (faq.helpful || 0) + 1 }
          : faq
      ));
    } catch {}
  };

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="faq-container">
      {/* Payment/Premium static FAQ box */}
      <FAQBox />

      {/* Header */}
      <div className="faq-header">
        <h1>❓ Frequently Asked Questions</h1>
        <p>Find answers to common questions about Ghorbari</p>
      </div>

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="success-message">
          <p>✓ {successMessage}</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>✗ {error}</p>
        </div>
      )}

      <div className="faq-content">
        {/* Left Section - FAQs List */}
        <div className="faqs-section">
          {/* Category Filter */}
          <div className="category-filter">
            <h3>Filter by Category</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Questions
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQs List */}
          <div className="faqs-list">
            {loading ? (
              <div className="loading">Loading FAQs...</div>
            ) : filteredFaqs.length === 0 ? (
              <div className="no-results">
                <p>No FAQs found in this category</p>
              </div>
            ) : (
              filteredFaqs.map(faq => (
                <div
                  key={faq._id}
                  className={`faq-item ${expandedId === faq._id ? 'expanded' : ''}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => handleToggleExpand(faq._id)}
                  >
                    <h3>{faq.question}</h3>
                    <span className="expand-icon">
                      {expandedId === faq._id ? '▼' : '▶'}
                    </span>
                  </div>

                  {expandedId === faq._id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                      {faq.description && (
                        <div className="additional-info">
                          <p>{faq.description}</p>
                        </div>
                      )}
                      <div className="faq-footer">
                        <button
                          className="helpful-btn"
                          onClick={() => handleHelpful(faq._id)}
                        >
                          👍 Helpful ({faq.helpful || 0})
                        </button>
                        <span className="views-count">
                          👁 {faq.views || 0} views
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Section - Submit Question Form */}
        <div className="submit-section">
          <div className="submit-card">
            <h2>Didn't find your answer?</h2>
            <p className="submit-subtitle">Submit your question and our team will respond within 24 hours</p>
            <form onSubmit={handleSubmitQuestion} className="question-form">
              {/* Question */}
              <div className="form-group">
                <label htmlFor="question">Your Question *</label>
                <input
                  id="question"
                  type="text"
                  name="question"
                  value={questionForm.question}
                  onChange={handleQuestionChange}
                  placeholder="What would you like to know?"
                  required
                  className="form-input"
                />
              </div>
              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={questionForm.category}
                  onChange={handleQuestionChange}
                  className="form-input"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Additional Details</label>
                <textarea
                  id="description"
                  name="description"
                  value={questionForm.description}
                  onChange={handleQuestionChange}
                  placeholder="Provide more context if needed (optional)"
                  rows="4"
                  className="form-input"
                />
              </div>
              {/* User Email */}
              <div className="form-group email-display">
                <label>Your Email</label>
                <p className="email-text">{user?.email}</p>
                <small>We'll reply to this email address</small>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-submit"
                disabled={submittingQuestion}
              >
                {submittingQuestion ? 'Submitting...' : '📤 Submit Question'}
              </button>
            </form>
            {/* Info Box */}
            <div className="info-box">
              <h4>📌 Quick Tips</h4>
              <ul>
                <li>Be specific and clear in your question</li>
                <li>Include relevant details for faster response</li>
                <li>Check similar questions first</li>
                <li>Check your email for our response</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
