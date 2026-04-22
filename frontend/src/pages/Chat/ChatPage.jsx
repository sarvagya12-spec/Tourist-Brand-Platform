import React, { useState } from 'react';
import { Send, Square, Bot } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Brand Analyst. Ask me anything about brand performance.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Dynamically get user info from localStorage (saved during Login)
  const userData = { 
    name: localStorage.getItem("name") || "User", 
    email: localStorage.getItem("email") || "Guest",
    role: localStorage.getItem("role") || "analyst"
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post("http://localhost:8003/ai/generate", 
        { prompt: input }, 
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Service Error:", error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error connecting to the AI service. Please make sure you are logged in." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <Navbar user={userData} onClear={() => setMessages([])} />

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
