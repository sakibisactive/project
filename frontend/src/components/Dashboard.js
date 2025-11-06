import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AdminDashboard from './AdminDashboard';
import PremiumDashboard from './PremiumDashboard';
import NonPremiumDashboard from './NonPremiumDashboard';

import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useLanguage();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  if (!user) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      {/* You can add a language toggle button here if you wish */}
      {/* <button onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}>
        {language === 'en' ? 'বাংলা' : 'English'}
      </button> */}

      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : user.role === 'premium' ? (
        <PremiumDashboard />
      ) : (
        <NonPremiumDashboard />
      )}
    </div>
  );
};

export default Dashboard;
