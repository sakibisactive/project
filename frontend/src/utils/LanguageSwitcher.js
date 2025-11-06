import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from './translations';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      {Object.entries(LANGUAGES).map(([lang, { name, flag }]) => (
        <button
          key={lang}
          className={`language-btn ${language === lang ? 'active' : ''}`}
          onClick={() => setLanguage(lang)}
          title={`Switch to ${name}`}
        >
          <span className="language-flag">{flag}</span>
          <span className="language-name">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
