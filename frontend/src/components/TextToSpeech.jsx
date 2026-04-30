/**
 * @module components/TextToSpeech
 * @description Text-to-speech button using the Web Speech API.
 * Supports reading module content aloud in English, Hindi, and Tamil.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../i18n/LanguageContext';

/** @constant {Object<string, string>} langVoiceMap - Maps app language codes to Web Speech API language codes */
const langVoiceMap = { en: 'en', hi: 'hi', ta: 'ta' };

/** @constant {RegExp} EMOJI_REGEX - Pattern to strip emojis and special characters from text for cleaner speech */
const EMOJI_REGEX = /[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}✅❌💡✓✕●○]/gu;

/**
 * Text-to-speech button component that reads provided text aloud.
 *
 * @param {Object} props
 * @param {string} props.text - The text content to read aloud
 * @returns {JSX.Element|null} Button element, or null if speech synthesis is not supported
 */
export default function TextToSpeech({ text }) {
  const { lang } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const utterRef = useRef(null);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // Stop speaking when text or language changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, [text, lang]);

  /** Toggles speech on/off — starts reading or stops current speech */
  const handleToggle = useCallback(() => {
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = text.replace(EMOJI_REGEX, '').trim();
    if (!cleanText) return;

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = langVoiceMap[lang] || 'en';
    utter.rate = 0.9;
    utter.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(utter.lang));
    if (match) utter.voice = match;

    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }, [supported, speaking, text, lang]);

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

TextToSpeech.propTypes = {
  /** The text content to be read aloud via speech synthesis */
  text: PropTypes.string.isRequired,
};
