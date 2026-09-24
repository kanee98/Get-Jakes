'use client';

import { useState } from 'react';
import { MessageSquareText, X, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ChatWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hello! 👋 Welcome to Get Jakes Cake Props & Toppers. How can I assist you with dummy cakes, custom toppers, photo props, or Bank Transfer orders today?",
      sender: "bot"
    }
  ]);

  const faqs = [
    {
      question: "What materials are used?",
      answer: "Our props use High-Density EPS Foam cores wrapped in 100% water-resistant polymer fondant coating."
    },
    {
      question: "Shipping & crate protection?",
      answer: "We offer studio shipping across North America and Europe with custom wooden crate protection."
    },
    {
      question: "How do bank payments work?",
      answer: "Select Bank Transfer at checkout. An order reference code (e.g. GJ-8821-PAY) will be generated for your bank transfer remarks!"
    }
  ];

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput('');

    setTimeout(() => {
      let botReply = "Thank you for reaching out! A Get Jakes studio specialist will respond shortly.";
      const lower = userText.toLowerCase();

      if (lower.includes('material') || lower.includes('foam')) {
        botReply = faqs[0].answer;
      } else if (lower.includes('ship') || lower.includes('delivery') || lower.includes('crate')) {
        botReply = faqs[1].answer;
      } else if (lower.includes('bank') || lower.includes('pay') || lower.includes('utr') || lower.includes('transfer')) {
        botReply = faqs[2].answer;
      }

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  const handleFaqClick = (faq) => {
    setMessages((prev) => [
      ...prev,
      { text: faq.question, sender: "user" },
      { text: faq.answer, sender: "bot" }
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="chat-widget">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chat-trigger"
          title="Live Get Jakes Assistant"
        >
          {isOpen ? (
            <X style={{ width: 28, height: 28 }} />
          ) : (
            <MessageSquareText style={{ width: 28, height: 28 }} />
          )}
          <span className="chat-pulse-badge"></span>
        </button>
      </div>

      {/* Floating Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-agent-info">
            <img
              src="/logo.png"
              alt="Get Jakes"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFF'
              }}
            />
            <div>
              <strong style={{ fontSize: '0.9rem', display: 'block', color: '#0F1415' }}>
                Get Jakes Assistant
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#0F1415', opacity: 0.85 }}>
                Online • Instant Replies
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#0F1415', cursor: 'pointer', padding: 4 }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="chat-body">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-msg ${m.sender}`}>
              {m.text}
            </div>
          ))}

          <div className="chat-faq-chips">
            {faqs.map((faq, idx) => (
              <button key={idx} className="faq-chip" onClick={() => handleFaqClick(faq)}>
                {faq.question}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about props or bank payments..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="icon-btn"
            style={{
              background: 'var(--color-black)',
              color: 'var(--color-brand)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send style={{ width: 16, height: 16 }} />
          </button>
        </form>
      </div>
    </>
  );
}
