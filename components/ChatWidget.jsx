'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Welcome to Get Jakes Props! How can our master artisans assist your studio today?", sender: "bot" }
  ]);

  const faqs = {
    "material": "Our props use High-Density EPS Foam cores wrapped in 100% water-resistant polymer fondant coating.",
    "shipping": "We offer studio shipping across North America and Europe with custom wooden crate protection.",
    "weight": "Props range from 2 lbs (mini sets) up to 7 lbs (5-tier grand display dummies)."
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, sender: "user" }]);
    setInput('');

    setTimeout(() => {
      let botReply = "Thank you for reaching out! A Get Jakes studio specialist will respond shortly.";
      const lower = userText.toLowerCase();
      if (lower.includes('material') || lower.includes('foam')) botReply = faqs.material;
      if (lower.includes('shipping') || lower.includes('delivery')) botReply = faqs.shipping;
      if (lower.includes('weight') || lower.includes('heavy')) botReply = faqs.weight;

      setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
    }, 600);
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot style={{ width: 20, height: 20, color: 'var(--color-brand)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Get Jakes Studio Assistant</h4>
                <span style={{ fontSize: '0.75rem', color: '#10B981' }}>● Live Studio Help</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender}`}>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              placeholder="Ask about materials, shipping, custom dimensions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
              <Send style={{ width: 14, height: 14 }} />
            </button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="chat-toggle-btn" title="Studio Support Chat">
        <MessageSquare style={{ width: 24, height: 24 }} />
      </button>
    </div>
  );
}
