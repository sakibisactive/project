import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLanguageTranslations } from '../utils/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Set language from localStorage or fallback to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [translations, setTranslations] = useState(getLanguageTranslations(language));

  // Update translations/map/HTML tag on language change
  useEffect(() => {
    setTranslations(getLanguageTranslations(language));
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    // Optionally support RTL: left here for easy future expansion
    document.documentElement.dir = (['ar', 'ur', 'he', 'fa'].includes(language)) ? 'rtl' : 'ltr';
  }, [language]);

  // Main translation function (returns key if translation missing)
  const t = (key) => {
    return translations[key] !== undefined ? translations[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Strongly prefer this hook for all translation/lookups:
 *  const { language, t, setLanguage } = useLanguage();
 *  let msg = t('yourDue');
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
