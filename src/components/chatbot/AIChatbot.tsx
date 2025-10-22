import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const { user, isAdmin, isProfessor, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getDisplayRole = () => {
    if (!user) return 'visitor';
    if (isAdmin) return 'admin';
    if (isProfessor) return 'professor';
    if (isStudent) return 'student';
    return 'visitor';
  };

  const getRoleName = (role: string) => {
    const roleNames = {
      visitor: 'Visiteur',
      student: 'Étudiant',
      professor: 'Professeur',
      admin: 'Administrateur',
    };
    return roleNames[role as keyof typeof roleNames] || 'Visiteur';
  };

  const getWelcomeMessage = (role: string) => {
    const messages = {
      visitor: "👋 Bienvenue sur AVS ! Je peux vous renseigner sur nos formations, certifications, et admissions. Comment puis-je vous aider ?",
      student: "👋 Bonjour Étudiant ! Je peux vous aider avec vos cours, notes, emploi du temps et toute question concernant votre parcours académique.",
      professor: "👋 Bonjour Professeur ! Je peux vous assister avec la gestion de vos cours, vos étudiants et les ressources pédagogiques.",
      admin: "👋 Bonjour Administrateur ! Je suis là pour vous guider dans la gestion de la plateforme, les utilisateurs et les paramètres système.",
    };
    return messages[role as keyof typeof messages] || messages.visitor;
  };

  const getQuickReplies = (role: string) => {
    const quickReplies = {
      visitor: [
        "📚 Quelles sont les formations disponibles ?",
        "💰 Informations sur les frais de scolarité",
        "📝 Comment s'inscrire ?",
        "🎓 Programmes de certification"
      ],
      student: [
        "📅 Mon emploi du temps",
        "📊 Consulter mes notes",
        "📚 Ressources de cours",
        "💬 Contacter un professeur"
      ],
      professor: [
        "👥 Gérer mes classes",
        "📝 Créer une évaluation",
        "📊 Statistiques des étudiants",
        "📚 Ressources pédagogiques"
      ],
      admin: [
        "👥 Gérer les utilisateurs",
        "📊 Tableau de bord",
        "⚙️ Paramètres système",
        "📈 Rapports d'activité"
      ]
    };
    return quickReplies[role as keyof typeof quickReplies] || quickReplies.visitor;
  };

  const displayRole = getDisplayRole();

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

  const streamChat = async (userMsg: Message) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: userMsg.content }] 
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        
        if (resp.status === 429) {
          toast.error('⏳ Trop de requêtes. Veuillez patienter quelques instants.');
        } else if (resp.status === 402) {
          toast.error('💳 Crédits insuffisants. Contactez l\'administrateur.');
        } else {
          toast.error('🔧 Service AI temporairement indisponible.');
        }
        
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        throw new Error('No response body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              
              setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === 'assistant' && lastMsg.id === assistantId) {
                  return prev.map((m) => 
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, {
                  id: assistantId,
                  role: 'assistant' as const,
                  content: assistantContent,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Streaming error:', err);
      toast.error('❌ Erreur de connexion au service AI.');
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await streamChat(userMessage);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const exportConversation = (format: 'json' | 'txt') => {
    if (messages.length === 0) {
      toast.error('Aucune conversation à exporter');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
      mimeType = 'application/json';
      filename = `conversation-avs-${timestamp}.json`;
    } else {
      content = messages.map(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString('fr-FR');
        const role = msg.role === 'user' ? 'Vous' : 'Assistant AVS';
        return `[${time}] ${role}:\n${msg.content}\n`;
      }).join('\n');
      mimeType = 'text/plain';
      filename = `conversation-avs-${timestamp}.txt`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Conversation exportée avec succès');
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
          className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 h-14 w-14 rounded-full shadow-lg z-[100000]"
          size="icon"
          aria-label="Ouvrir le chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 w-[min(24rem,calc(100vw-1.5rem))] sm:w-96 h-[min(75vh,36rem)] sm:h-[32rem] flex flex-col shadow-2xl z-[100000] animate-in slide-in-from-bottom-5 overflow-hidden">
          {/* Header with curved wave */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center ring-2 ring-white/20">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-300">Chat with</p>
                    {user && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30"
                      >
                        {getRoleName(displayRole)}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-white">Assistant AVS</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/10"
                        aria-label="Exporter la conversation"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); exportConversation('txt'); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter en TXT
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); exportConversation('json'); }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter en JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
            </div>
            <div className="px-4 pb-4 relative z-10">
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
                <>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {getWelcomeMessage(displayRole)}
                    </p>
                  </div>
                  
                  {/* Quick Reply Suggestions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">Suggestions rapides</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {getQuickReplies(displayRole).map((reply, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          variant="outline"
                          className="justify-start text-left h-auto py-3 px-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-normal text-gray-700 dark:text-gray-300"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
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
                onClick={() => sendMessage()}
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
