import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/analytics";

export type ChatbotEventType = 
  | 'chatbot_opened' 
  | 'chatbot_closed' 
  | 'message_sent' 
  | 'quick_reply_clicked'
  | 'contact_action'
  | 'conversation_started'
  | 'file_uploaded'
  | 'error'
  | 'response_received'
  | 'connection_error';

export interface ChatbotAnalyticsData {
  event_type: ChatbotEventType;
  event_data?: Record<string, any>;
  conversation_id?: string;
}

export const useChatbotAnalytics = () => {
  const trackChatbotEvent = async (data: ChatbotAnalyticsData) => {
    try {
      // Track in Google Analytics
      trackEvent({
        action: data.event_type,
        category: 'chatbot',
        label: data.conversation_id,
        ...data.event_data
      });

      // Track in Supabase if conversation exists
      if (data.conversation_id) {
        const { data: session } = await supabase.auth.getSession();
        
        await supabase.from('chatbot_analytics').insert({
          conversation_id: data.conversation_id,
          user_id: session?.session?.user?.id || null,
          event_type: data.event_type,
          event_data: data.event_data || {}
        });
      }
    } catch (error) {
      console.error('Error tracking chatbot event:', error);
    }
  };

  return { trackChatbotEvent };
};
