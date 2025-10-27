import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import es from "../locales/es.json";

const LanguageContext = createContext();

const translations = { en, es };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang");
      if (storedLang) {
        setLang(storedLang);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  };

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
