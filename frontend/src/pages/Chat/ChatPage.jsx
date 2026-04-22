import React, { useState } from 'react';
import { Send, Square, Bot } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Brand Analyst. Ask me anything about brand performance.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // This will eventually come from your Auth service
  const user = { name: "Manvi", email: "manvig00123@gmail.com" };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // AI Logic would go here (Axios call to Port 8003)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Analysis complete..." }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="chat-container">
      <Navbar user={user} onClear={() => setMessages([])} />

      <main className="messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role === 'user' ? 'user-msg' : ''}`}>
            {msg.role === 'assistant' && <div className="bot-icon"><Bot size={20} /></div>}
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}
      </main>

      <footer className="input-container">
        <div className="input-wrapper">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query brand data or market share..." 
            className="chat-input"
          />
          <div className="input-actions">
            {isTyping ? (
              <button onClick={() => setIsTyping(false)} className="stop-btn"><Square size={18} fill="white" /></button>
            ) : (
              <button onClick={handleSend} className="send-btn"><Send size={18} /></button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
