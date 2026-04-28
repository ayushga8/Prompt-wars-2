import { useLanguage } from '../i18n/LanguageContext';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hi', label: 'हिन्दी', flag: 'HI' },
  { code: 'ta', label: 'தமிழ்', flag: 'TA' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="lang-globe">🌐</span>
        <span className="lang-current">{current.label}</span>
        <span className={`lang-chevron ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="lang-dropdown glass" role="listbox" aria-label="Select language">
          {languages.map(l => (
            <button
              key={l.code}
              className={`lang-option ${lang === l.code ? 'active' : ''}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
              role="option"
              aria-selected={lang === l.code}
            >
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
