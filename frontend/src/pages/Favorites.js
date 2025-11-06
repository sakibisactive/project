import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/favorites', { headers });
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  return (
    <div className="favorites-page">
      <h2>My Favorite Properties</h2>
      
      {favorites.length === 0 ? (
        <p>You haven't added any properties to your favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(propId => (
            <div key={propId} className="favorite-item">
              <button onClick={() => window.location.href = `/property/${propId}`}>
                View Property {propId}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;