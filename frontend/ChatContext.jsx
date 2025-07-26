import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Load all past conversations (Milestone 8)
  useEffect(() => {
    axios.get("http://localhost:5000/conversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error("Error loading conversations:", err));
  }, []);

  // Load a specific conversation
  const loadConversation = (id) => {
    setLoading(true);
    axios.get(`http://localhost:5000/conversations/${id}`)
      .then(res => {
        setMessages(res.data.messages);
        setCurrentConversationId(id);
      })
      .catch(err => console.error("Error loading conversation:", err))
      .finally(() => setLoading(false));
  };

  const sendMessage = async (text) => {
    const userMessage = { sender: "user", text };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: text,
        conversationId: currentConversationId, // for continuity
      });

      const aiMessage = { sender: "ai", text: response.data.reply };
      setMessages(prev => [...prev, aiMessage]);

      // If it's a new conversation, update history
      if (!currentConversationId && response.data.conversationId) {
        setCurrentConversationId(response.data.conversationId);
        setConversations(prev => [...prev, { id: response.data.conversationId }]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      loading,
      conversations,
      currentConversationId,
      sendMessage,
      loadConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
};
