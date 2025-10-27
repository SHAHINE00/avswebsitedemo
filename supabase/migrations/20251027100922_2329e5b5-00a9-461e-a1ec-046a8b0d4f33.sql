-- Function to cleanup conversations older than 1 hour
CREATE OR REPLACE FUNCTION cleanup_old_chatbot_conversations()
RETURNS void AS $$
BEGIN
  DELETE FROM chatbot_conversations
  WHERE last_message_at < NOW() - INTERVAL '1 hour'
     OR (last_message_at IS NULL AND created_at < NOW() - INTERVAL '1 hour');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation timestamp when message is added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chatbot_conversations
  SET last_message_at = NOW(), updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update conversation timestamps
DROP TRIGGER IF EXISTS update_conversation_on_message ON chatbot_messages;
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON chatbot_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();