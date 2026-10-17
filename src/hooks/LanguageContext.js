import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import en from '../locales/en.json';
import es from '../locales/es.json';

const LanguageContext = createContext();

const translations = { en, es };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        setLang(storedLang);
      }
    }
  }, []);

  // English is the default; only an explicit choice is persisted
  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    try {
      localStorage.setItem('lang', next);
    } catch (e) {
      // storage unavailable: the choice just lasts for this visit
    }
  };

  const t = key => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>{children}</LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node,
};

export const useLanguage = () => useContext(LanguageContext);
