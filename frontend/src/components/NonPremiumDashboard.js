import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Explore from '../pages/Explore';
import './NonPremiumDashboard.css';

// For non-premium users, the dashboard should provide the same
// exploration experience as the premium "Explore" page, without
// premium-only actions (handled inside the details page).
const NonPremiumDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Explore />
  );
};

export default NonPremiumDashboard;