import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title?: string;
  language: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  user_id?: string;
  visitor_id?: string;
  metadata?: any;
}

export const useChatbotPersistence = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load user conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        // For anonymous users, try to load from localStorage
        const visitorId = localStorage.getItem('visitor_id') || crypto.randomUUID();
        localStorage.setItem('visitor_id', visitorId);
        
        const { data, error } = await supabase
          .from('chatbot_conversations')
          .select('*')
          .eq('visitor_id', visitorId)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setConversations(data || []);
        return;
      }

      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new conversation
  const createConversation = async (language: string = 'fr') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      const visitorId = !userId ? (localStorage.getItem('visitor_id') || crypto.randomUUID()) : null;
      
      if (!userId && visitorId) {
        localStorage.setItem('visitor_id', visitorId);
      }

      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: userId,
          visitor_id: visitorId,
          language,
          title: 'Nouvelle conversation'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setCurrentConversationId(data.id);
      setConversations(prev => [data, ...prev]);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  // Save message to conversation
  const saveMessage = async (conversationId: string, message: Message) => {
    try {
      const { error } = await supabase
        .from('chatbot_messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          metadata: {}
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      return (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  // Update conversation title
  const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .update({ title })
        .eq('id', conversationId);
        
      if (error) throw error;
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, title } : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .delete()
        .eq('id', conversationId);
        
      if (error) throw error;
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
      
      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    loading,
    createConversation,
    saveMessage,
    loadMessages,
    updateConversationTitle,
    deleteConversation,
    loadConversations
  };
};
