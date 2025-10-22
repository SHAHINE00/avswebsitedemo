-- Phase 2: Enhanced Conversation Persistence
-- Create persistent conversations table
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT,
  title TEXT,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create persistent messages table  
CREATE TABLE IF NOT EXISTS public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversation analytics table
CREATE TABLE IF NOT EXISTS public.chatbot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_analytics ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON public.chatbot_conversations FOR SELECT
  USING (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Users can create conversations"
  ON public.chatbot_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Users can update their own conversations"
  ON public.chatbot_conversations FOR UPDATE
  USING (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Users can delete their own conversations"
  ON public.chatbot_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON public.chatbot_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_conversations
      WHERE chatbot_conversations.id = chatbot_messages.conversation_id
      AND (chatbot_conversations.user_id = auth.uid() OR chatbot_conversations.visitor_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.chatbot_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbot_conversations
      WHERE chatbot_conversations.id = chatbot_messages.conversation_id
      AND (chatbot_conversations.user_id = auth.uid() OR chatbot_conversations.visitor_id IS NOT NULL)
    )
  );

-- Analytics policies
CREATE POLICY "Users can view their conversation analytics"
  ON public.chatbot_analytics FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create analytics"
  ON public.chatbot_analytics FOR INSERT
  WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can view all conversations"
  ON public.chatbot_conversations FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all messages"
  ON public.chatbot_messages FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all analytics"
  ON public.chatbot_analytics FOR ALL
  USING (is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON public.chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_visitor_id ON public.chatbot_conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_updated_at ON public.chatbot_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id ON public.chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON public.chatbot_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_conversation_id ON public.chatbot_analytics(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_user_id ON public.chatbot_analytics(user_id);

-- Create function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_chatbot_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chatbot_conversations
  SET updated_at = now(), last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update conversation timestamp
CREATE TRIGGER update_chatbot_conversation_timestamp_trigger
AFTER INSERT ON public.chatbot_messages
FOR EACH ROW
EXECUTE FUNCTION update_chatbot_conversation_timestamp();