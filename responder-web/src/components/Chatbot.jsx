import React, { useState, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I’m your AI Health Assistant Chris powered by NVIDIA. How can I support you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Send user message and get NVIDIA backend reply
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/nlp/nvidia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "frontend_user",
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "⚠️ Sorry, I couldn't get a response from the NVIDIA AI model.";

      setMessages([...updatedMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages([
        ...updatedMessages,
        {
          sender: "bot",
          text:
            "❌ Unable to reach the AI service. Please check if the backend (FastAPI + NVIDIA API) is running.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <h4>🩺 AI Health Assistant</h4>
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">💬 AI is thinking...</div>}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          placeholder="Ask anything about first aid or emergencies..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
