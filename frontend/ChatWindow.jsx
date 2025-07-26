import React, { useState } from 'react';
import axios from 'axios'; // 👈 Add axios

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    setInput("");

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: input
      });

      const botMessage = {
        text: response.data.reply,
        sender: "bot"
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error talking to server:", error);
      setMessages(prev => [...prev, {
        text: "Oops! Server error.",
        sender: "bot"
      }]);
    }
  };

  // ... keep the rest same (UI)

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.message, alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end" }}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "sans-serif"
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "300px",
    overflowY: "scroll",
    marginBottom: "10px",
    background: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px"
  },
  message: {
    padding: "10px",
    background: "#e0e0e0",
    borderRadius: "10px",
    maxWidth: "80%"
  },
  inputContainer: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Chatbot;
