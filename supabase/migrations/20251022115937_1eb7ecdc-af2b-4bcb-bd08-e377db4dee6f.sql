-- Fix search_path for chatbot conversation timestamp function
CREATE OR REPLACE FUNCTION update_chatbot_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chatbot_conversations
  SET updated_at = now(), last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;