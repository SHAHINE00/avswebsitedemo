import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus textarea when opening chat
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get current session to check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: userMessage.content },
        headers: session?.access_token 
          ? { Authorization: `Bearer ${session.access_token}` }
          : undefined,
      });

      if (error) {
        if (error.message?.includes('rate limit')) {
          toast.error('Trop de messages envoyés. Veuillez patienter.');
        } else {
          toast.error('Erreur de connexion. Veuillez réessayer.');
        }
        // Remove user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        return;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Une erreur est survenue.');
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          aria-label="Ouvrir le chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[32rem] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-5 overflow-hidden">
          {/* Header with curved wave */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="flex items-center justify-between p-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center ring-2 ring-white/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Chat with</p>
                  <h3 className="font-semibold text-white">Assistant AVS</h3>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                aria-label="Fermer le chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-200">Nous sommes en ligne !</p>
            </div>
            {/* Curved wave SVG */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              style={{ height: '40px' }}
            >
              <path
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
                fill="hsl(var(--background))"
              />
            </svg>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-950">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👋 Bonjour ! Je suis l'assistant AVS. Choisissez une option ci-dessous ou écrivez un message pour commencer.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                className="min-h-[50px] max-h-[120px] resize-none rounded-2xl border-gray-200 dark:border-gray-700"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shrink-0"
                aria-label="Envoyer le message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
