import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setError('');
    try {
      await axios.delete(`http://localhost:5001/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Delete account failed');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="delete-account-container">
      <h2>Delete Account</h2>
      <p>
        This action will permanently delete your account and all related data.
      </p>
      {error && <div className="error-message">{error}</div>}
      {!confirm ? (
        <button className="btn-danger" onClick={() => setConfirm(true)}>
          Confirm Delete
        </button>
      ) : (
        <div>
          <p>Are you absolutely sure?</p>
          <button className="btn-danger" onClick={handleDelete}>Yes, Delete My Account</button>
          <button className="btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;