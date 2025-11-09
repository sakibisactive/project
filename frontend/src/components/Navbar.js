import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaBell, FaMoon, FaSun, FaHome, FaGlobe } from 'react-icons/fa';
import { FiMoreVertical, FiUser, FiPenTool, FiDollarSign, FiHelpCircle, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const { t, language, setLanguage } = useLanguage(); // useLanguage hook must provide 'language'
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Language toggle function for globe icon
  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  if (!user) return null;

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        {/* ========== LEFT SECTION - LOGO ========== */}
        <span
          style={{ cursor: 'pointer', fontSize: '2.8em' }}
          onClick={() => navigate('/dashboard')}
          title="Home"
        >
          <FaHome />
        </span>

        {/* ========== RIGHT SECTION - ICONS ========== */}
        <div className="navbar-right">
          {/* User Info */}
          <span className="user-info">
            {t('')} <strong>{user.name}</strong>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'premium'
                ? t('premium')
                : user.role === 'admin'
                ? 'Admin'
                : t('regular')}
            </span>
          </span>

          {/* Notification Bell */}
          <Link to="/notifications" className="icon-btn notification-btn" title={t('notifications')}>
            <FaBell size={18} />
            <span className="notification-badge"></span>
          </Link>

          {/* Dark Mode Toggle */}
          <button className="icon-btn dark-mode-btn" onClick={toggleDarkMode} title={t('darkMode')}>
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Profile Button with Dropdown */}
          <div className="profile-dropdown">
            <button
              className="icon-btn profile-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title={t('profile')}
            >
              <FiMoreVertical  size={18} />
            </button>
            {isProfileMenuOpen && (
              <div className="profile-dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                  <FiUser size={16} />
                  <span>{t('profile')}</span>
                </Link>
                <Link 
                  to="/stories"
                  className="dropdown-item" 
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <FiPenTool size={16} />
                  <span>{t('stories')}</span>
                </Link>
                {user.role !== 'admin' && (
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                    <FiHeart size={16} />
                    <span>{t('wishlist')}</span>
                  </Link>
                )}
                {user.role === 'premium' && (
                  <>
                    <Link to="/payment" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                      <FiDollarSign size={16} />
                      <span>{t('Payment')}</span>
                    </Link>
                    
                    <Link to="/advertise" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                      📤<span>{t('advertise')}</span>
                    </Link>
                  </>
                )}
                <Link to="/faq" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                  <FiHelpCircle size={16} />
                  <span>{t('faq')}</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  🚪<span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Language Toggle (Globe) */}
          <button
            className="icon-btn language-btn"
            title={language === 'en' ? '[translate:বাংলা]' : 'English'}
            onClick={handleLanguageToggle}
          >
            <FaGlobe size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
