import { createContext, useContext, useState, useEffect } from 'react';
import en from './en';
import hi from './hi';
import ta from './ta';

const translations = { en, hi, ta };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('appLang') || 'en';
    } catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('appLang', lang); } catch {}
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
