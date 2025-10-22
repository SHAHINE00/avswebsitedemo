import { useEffect } from 'react';
import { generateConversationTitle } from '@/utils/chatbotUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatbotAutoTitleProps {
  messages: Message[];
  conversationId: string | null;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
}

/**
 * Automatically generates and updates conversation titles based on first user message
 */
export const useChatbotAutoTitle = ({
  messages,
  conversationId,
  updateConversationTitle
}: UseChatbotAutoTitleProps) => {
  useEffect(() => {
    if (!conversationId || messages.length === 0) return;

    // Find first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    
    if (firstUserMessage && messages.length <= 2) {
      // Only update title for new conversations (first exchange)
      const title = generateConversationTitle(firstUserMessage.content);
      updateConversationTitle(conversationId, title);
    }
  }, [messages, conversationId]);
};
