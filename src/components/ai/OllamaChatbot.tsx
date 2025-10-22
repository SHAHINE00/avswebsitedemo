import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from '@/components/chatbot/ChatMessage';
import TypingIndicator from '@/components/chatbot/TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function OllamaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate visitor ID for anonymous users
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load session on open
  useEffect(() => {
    if (isOpen) {
      const savedSessionId = localStorage.getItem('chat_session_id');
      if (savedSessionId) {
        setSessionId(savedSessionId);
        loadSessionHistory(savedSessionId);
      }
    }
  }, [isOpen]);

  const loadSessionHistory = async (sessId: string) => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('session_id', sessId)
        .order('created_at', { ascending: true });
      
      if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.created_at)
        })));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearConversation = async () => {
    if (sessionId) {
      await supabase
        .from('chat_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
    localStorage.removeItem('chat_session_id');
    setSessionId(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        'https://nkkalmyhxtuisjdjmdew.supabase.co/functions/v1/ollama-chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
          },
          body: JSON.stringify({ 
            message: userMessage.content,
            sessionId: sessionId,
            visitorId: getVisitorId()
          }),
        }
      );

      // Save session ID from response
      const newSessionId = response.headers.get('X-Session-Id');
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem('chat_session_id', newSessionId);
      }

      // Handle error responses before streaming
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (response.status === 429) {
          toast({
            title: "Limite de requêtes atteinte",
            description: "Trop de messages envoyés. Veuillez patienter quelques instants.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Crédit insuffisant",
            description: "Le service nécessite des crédits supplémentaires. Contactez l'administrateur.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: errorData?.error || "Impossible de contacter le serveur.",
            variant: "destructive",
          });
        }
        
        setMessages(prev => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) throw new Error('No response stream');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          
          try {
            const jsonStr = line.replace(/^data: /, '');
            const data = JSON.parse(jsonStr);
            
            // Check if this is an error response
            if (data.error) {
              console.error('Stream error:', data.error);
              toast({
                title: "Erreur",
                description: data.error,
                variant: "destructive",
              });
              
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && !last.content.trim()) {
                  return prev.slice(0, -1);
                }
                return prev;
              });
              
              break;
            }
            
            if (data.message?.content) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + data.message.content }
                    : msg
                )
              );
            }
          } catch (parseError) {
            console.error('Parse error:', parseError);
          }
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Désolé, une erreur est survenue.';
      if (error.message?.includes('429')) {
        errorMessage = 'Trop de requêtes. Veuillez patienter.';
      } else if (error.message?.includes('408')) {
        errorMessage = 'Délai dépassé. Réessayez dans quelques secondes.';
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        aria-label="Ouvrir le chat IA"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Assistant AVS.ma</h3>
            <p className="text-xs text-white/80">Propulsé par Ollama</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-white hover:bg-white/20 text-xs h-8"
            >
              Nouvelle conversation
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 ? (
          <div className="text-center space-y-6 py-8 px-4">
            <div className="text-5xl animate-bounce">👋</div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">Bonjour! Comment puis-je vous aider?</p>
              <p className="text-sm text-muted-foreground">Je peux vous renseigner sur:</p>
            </div>
            <ul className="space-y-3 text-sm text-left max-w-sm mx-auto">
              <li className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                <span className="text-lg">📚</span>
                <span>Les formations et cours disponibles</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                <span className="text-lg">⚙️</span>
                <span>Les fonctionnalités de la plateforme</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                <span className="text-lg">✍️</span>
                <span>Le processus d'inscription</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors border border-border">
                <span className="text-lg">🎓</span>
                <span>Les certifications disponibles</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-border max-w-sm mx-auto">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Note:</strong> Je suis spécialisé dans AVS.ma uniquement. Je ne peux pas aider avec des questions sur les hôtels, restaurants, météo, etc.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
