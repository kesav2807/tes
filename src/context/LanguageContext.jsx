import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'ta'; // default to Tamil or English
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key, fallback = '') => {
    if (language === 'ta') {
      return translations.ta[key] || translations.en[key] || fallback || key;
    }
    if (language === 'both') {
      const enStr = translations.en[key] || fallback || key;
      const taStr = translations.ta[key];
      if (taStr && taStr !== enStr) {
        return `${enStr} / ${taStr}`;
      }
      return enStr;
    }
    return translations.en[key] || fallback || key;
  };

  const getText = (item, field = 'name') => {
    if (!item) return '';
    const enText = item[field] || '';
    const taText = item[`${field}Ta`] || item[`${field}_ta`] || '';

    if (language === 'ta') {
      return taText || enText;
    }
    if (language === 'both') {
      return taText ? `${enText} / ${taText}` : enText;
    }
    return enText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
