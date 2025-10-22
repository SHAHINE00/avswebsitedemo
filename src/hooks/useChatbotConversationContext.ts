import { useEffect, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Hook to manage conversation context for better AI responses
 * Maintains recent message history to provide context to AI
 */
export const useChatbotConversationContext = () => {
  const [conversationContext, setConversationContext] = useState<Message[]>([]);
  const maxContextMessages = 10; // Keep last 10 messages for context

  const addToContext = (message: Message) => {
    setConversationContext(prev => {
      const updated = [...prev, message];
      // Keep only last N messages to avoid token limits
      return updated.slice(-maxContextMessages);
    });
  };

  const clearContext = () => {
    setConversationContext([]);
  };

  const getContextForAI = () => {
    // Format messages for AI consumption
    return conversationContext.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  };

  return {
    conversationContext,
    addToContext,
    clearContext,
    getContextForAI
  };
};
