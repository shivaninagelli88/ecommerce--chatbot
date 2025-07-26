import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const UserInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage } = useContext(ChatContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", padding: "1rem" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ flex: 1, padding: "0.5rem" }}
        placeholder="Type your message..."
      />
      <button type="submit" style={{ marginLeft: "0.5rem" }}>
        Send
      </button>
    </form>
  );
};

export default UserInput;
