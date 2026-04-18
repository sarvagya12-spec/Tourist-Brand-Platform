import { useState, useEffect, useRef } from "react";
import "./Chat.css";

function Chat() {
  const [convId, setConvId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);  

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjllMWMzNWEzMTc0YjAwY2M2ZmNiM2Y0IiwiZW1haWwiOiJtYXhAZXhhbXBsZS5jb20iLCJyb2xlIjoidG91cmlzdCIsImV4cCI6MTc3NjQzMDIwMywidHlwZSI6ImFjY2VzcyJ9.RFBqJ1lDt8nnf1HOMi713asLPkxMiehqFepkBtBqwgk";

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
        setMessages(prev => [...prev, parsed.user_message, parsed.ai_response]);
      };

      socketRef.current = ws;  
    };

    init();

    return () => socketRef.current?.close();  
  }, []);

  const sendMessage = () => {
    if (!input || !socketRef.current) return;
    socketRef.current.send(input);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>

      {/* Messages */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <input
  className="chat-input"
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>
      <button className="chat-button" onClick={sendMessage}>
  Send
</button>
    </div>
  );
}

export default Chat;
