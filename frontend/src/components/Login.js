import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  // Get login function from AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send login POST request
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // IMPORTANT: Save token and user in context + localStorage!
      login(res.data.token, res.data.user);

      // Redirect after login based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to GHORBARI</h2>
        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="auth-link">
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
