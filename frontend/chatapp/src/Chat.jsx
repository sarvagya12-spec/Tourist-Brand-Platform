import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Navbar } from "../components/Navbar";

function Chat() {
  const [convId, setConvId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);  

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjllMWMzNWEzMTc0YjAwY2M2ZmNiM2Y0IiwiZW1haWwiOiJtYXhAZXhhbXBsZS5jb20iLCJyb2xlIjoidG91cmlzdCIsImV4cCI6MTc3NjY4MzQwNSwidHlwZSI6ImFjY2VzcyJ9.SyeSo7ZiuUXbbz4Wy32YXTAVoD0pM5jDJNmsKeIxRdc";

  useEffect(() => {
    const init = async () => {
      const res = await fetch("http://localhost:8000/conversations/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setConvId(data.conv_id);

      const ws = new WebSocket(
        `ws://localhost:8000/ws/chat/${data.conv_id}?token=${token}`
      );

      ws.onopen = () => console.log("Connected");
      ws.onclose = () => console.log("Disconnected");

      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        setTyping(false);
        setMessages(prev => [...prev, parsed.ai_response]);
      };

      socketRef.current = ws;  
    };

    init();

    return () => socketRef.current?.close();  
  }, []);

  const sendMessage = () => {
    if (!input || !socketRef.current) return;
    setMessages(prev => [...prev,
    { role: "user", content: input }]);
    setTyping(true);
    socketRef.current.send(input);
    setInput("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-navbar">
        <Navbar />
      </div>
      <div className="hero-panel">
        <div className="hero-copy">
          <h1>Discover your next  escape</h1>
          <p>Ask your AI travel assistant for destinations, trip plans, and local travel tips.</p>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div>
            <p className="chat-title">AI Travel Assistant</p>
            <p className="chat-subtitle">Your personalized travel planning companion</p>
          </div>
        </div>

        <div className="chat-box">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.role === "user" ? "user" : "bot"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {typing && (
            <div className="typing-indicator">Assistant is thinking...</div>
          )}
        </div>

        <div className="chat-input-container">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your trip..."
          />
          <button className="chat-button" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;