import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // FIXED: login will save token, update state, and set user
  const login = (receivedToken, receivedUser) => {
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);  // This triggers useEffect to reload user and updates context state!
    setUser(receivedUser);    // Optionally set user right away if you want instant UI update
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
