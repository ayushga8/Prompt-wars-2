import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const langVoiceMap = { en: 'en', hi: 'hi', ta: 'ta' };

export default function TextToSpeech({ text }) {
  const { lang } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utterRef = useRef(null);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  useEffect(() => {
    // Stop speaking when text or language changes
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, [text, lang]);

  const handleToggle = () => {
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    // Clean text — strip emojis and special chars for cleaner speech
    const cleanText = text.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}✅❌💡✓✕●○]/gu, '').trim();
    if (!cleanText) return;

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = langVoiceMap[lang] || 'en';
    utter.rate = 0.9;
    utter.pitch = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(utter.lang));
    if (match) utter.voice = match;

    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  if (!supported) return null;

  return (
    <button
      className={`tts-btn ${speaking ? 'speaking' : ''}`}
      onClick={handleToggle}
      aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
      title={speaking ? 'Stop' : 'Read aloud'}
    >
      {speaking ? '⏹️' : '🔊'}
    </button>
  );
}
