import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './AdminQuestions.css';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/admin/pending-questions');
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching questions');
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId) => {
    try {
      if (!answers[questionId] || answers[questionId].trim() === '') {
        setError('Please provide an answer');
        return;
      }

      await axios.post('/api/admin/answer-question', { 
        questionId, 
        answer: answers[questionId] 
      });
      fetchQuestions(); // Refresh the list
      setAnswers(prev => ({
        ...prev,
        [questionId]: ''
      }));
    } catch (error) {
      setError('Error submitting answer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-questions">
      <h2>FAQ Management</h2>
      <div className="questions-list">
        {questions.length === 0 ? (
          <p>No pending questions</p>
        ) : (
          questions.map(question => (
            <div key={question._id} className="question-card">
              <div className="question-info">
                <h3>From: {question.userId.name}</h3>
                <p className="question-content">{question.question}</p>
                <p className="question-date">Asked on: {new Date(question.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="answer-section">
                <textarea
                  value={answers[question._id] || ''}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [question._id]: e.target.value
                  }))}
                  placeholder="Write your answer here..."
                  rows={4}
                />
                <button
                  className="submit-btn"
                  onClick={() => handleAnswer(question._id)}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;