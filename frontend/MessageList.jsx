import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";

const MessageList = () => {
  const { messages } = useContext(ChatContext);

  return (
    <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
