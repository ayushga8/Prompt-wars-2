import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = '';
export default function ChatPanel({ moduleContext, onClose }) {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t('chatGreeting')(moduleContext) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update context message when module or language changes
  useEffect(() => {
    setMessages([
      { role: 'assistant', text: t('chatGreeting')(moduleContext) }
    ]);
  }, [moduleContext, lang]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, moduleContext, lang })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || t('chatFallback') }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: t('chatError') }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel glass" role="dialog" aria-label={t('chatTitle')}>
      <div className="chat-header">
        <h3 id="chat-title">{t('chatTitle')}</h3>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close chat panel">✕</button>
      </div>

      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="msg-bubble" aria-label={msg.role === 'user' ? 'Your message' : 'AI response'}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="msg-bubble typing" aria-label="AI is thinking">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <label htmlFor="chat-input-field" className="sr-only">{t('chatPlaceholder')}</label>
        <input
          id="chat-input-field"
          className="chat-input"
          placeholder={t('chatPlaceholder')}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby="chat-title"
        />
        <button className="chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()} aria-label="Send message">
          ➤
        </button>
      </div>
    </div>
  );
}
