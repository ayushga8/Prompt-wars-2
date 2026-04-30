/**
 * @module components/LanguageSwitcher
 * @description Dropdown language selector supporting English, Hindi, and Tamil.
 * Closes on outside click and persists selection via LanguageContext.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/** @constant {Array<{code: string, label: string, flag: string}>} languages - Available language options */
const languages = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hi', label: 'हिन्दी', flag: 'HI' },
  { code: 'ta', label: 'தமிழ்', flag: 'TA' },
];

/**
 * Language switcher dropdown component.
 * @returns {JSX.Element}
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /** Selects a language and closes the dropdown */
  const selectLanguage = useCallback((code) => {
    setLang(code);
    setOpen(false);
  }, [setLang]);

  const current = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button className="lang-toggle" onClick={() => setOpen(!open)}
        aria-label="Change language" aria-expanded={open}>
        <span className="lang-globe">🌐</span>
        <span className="lang-current">{current.label}</span>
        <span className={`lang-chevron ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="lang-dropdown glass" role="listbox" aria-label="Select language">
          {languages.map(l => (
            <button key={l.code} className={`lang-option ${lang === l.code ? 'active' : ''}`}
              onClick={() => selectLanguage(l.code)} role="option" aria-selected={lang === l.code}>
              <span className="lang-flag">{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
