import { useState, useRef, useEffect } from 'react';

const BACKEND_URL = '';
export default function ChatPanel({ moduleContext, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm your Election Education AI assistant. You're currently in the "${moduleContext}" module. Ask me anything about elections!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update context message when module changes
  useEffect(() => {
    setMessages([
      { role: 'assistant', text: `Hi! I'm your Election Education AI assistant. You're currently in the "${moduleContext}" module. Ask me anything about elections!` }
    ]);
  }, [moduleContext]);

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
        body: JSON.stringify({ message: userMsg, moduleContext })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Sorry, I could not generate a response.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Unable to reach the AI server. Make sure the backend is running.' }]);
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
    <div className="chat-panel glass" role="dialog" aria-label="AI Election Tutor chat">
      <div className="chat-header">
        <h3 id="chat-title">🤖 AI Election Tutor</h3>
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
        <label htmlFor="chat-input-field" className="sr-only">Type your question about elections</label>
        <input
          id="chat-input-field"
          className="chat-input"
          placeholder="Ask about elections..."
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
