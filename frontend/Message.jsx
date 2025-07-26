import React from "react";

const Message = ({ message }) => {
  const isUser = message.sender === "user";

  const styles = {
    alignSelf: isUser ? "flex-end" : "flex-start",
    backgroundColor: isUser ? "#daf8cb" : "#f0f0f0",
    borderRadius: "10px",
    padding: "0.5rem 1rem",
    margin: "0.5rem 0",
    maxWidth: "70%",
  };

  return <div style={styles}>{message.text}</div>;
};

export default Message;
