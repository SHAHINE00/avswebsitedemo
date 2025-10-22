import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MessageFeedbackProps {
  messageId: string;
  conversationId: string;
}

const MessageFeedback: React.FC<MessageFeedbackProps> = ({ messageId, conversationId }) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (submitted) return;

    try {
      setFeedback(type);
      setSubmitted(true);

      // Save feedback to analytics
      await supabase.from('chatbot_analytics').insert({
        conversation_id: conversationId,
        event_type: 'message_feedback',
        event_data: {
          message_id: messageId,
          feedback: type,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: type === 'positive' ? '✅ Merci pour votre retour !' : '📝 Merci, nous améliorerons cela',
        description: type === 'positive' 
          ? 'Nous sommes ravis que la réponse vous ait aidé'
          : 'Votre feedback nous aide à améliorer nos réponses'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitted(false);
      setFeedback(null);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
        {feedback === 'positive' ? '✓ Utile' : '✓ Retour enregistré'}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback('positive')}
        className="h-7 px-2"
      >
        <ThumbsUp className="w-3 h-3 mr-1" />
        <span className="text-xs">Utile</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback('negative')}
        className="h-7 px-2"
      >
        <ThumbsDown className="w-3 h-3 mr-1" />
        <span className="text-xs">Pas utile</span>
      </Button>
    </div>
  );
};

export default MessageFeedback;
