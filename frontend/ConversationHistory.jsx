import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ConversationHistory = () => {
  const { conversations, loadConversation } = useContext(ChatContext);

  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "1rem" }}>
      <h4>Conversation History</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {conversations.map((conv, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button onClick={() => loadConversation(conv.id)}>
              Conversation #{conv.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationHistory;
