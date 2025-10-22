import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
        "📞 Appeler AVS",
        "💬 Contacter via WhatsApp",
        "📧 Envoyer un email"
      ],
      student: [
        "📅 Mon emploi du temps",
        "📊 Consulter mes notes",
        "📚 Ressources de cours",
        "💬 Contacter un professeur",
        "📞 Appeler l'administration",
        "👤 Parler à un agent"
      ],
      professor: [
        "👥 Gérer mes classes",
        "📝 Créer une évaluation",
        "📊 Statistiques des étudiants",
        "📚 Ressources pédagogiques",
        "📞 Contacter l'administration",
        "💬 Support technique"
      ],
      admin: [
        "👥 Gérer les utilisateurs",
        "📊 Tableau de bord",
        "⚙️ Paramètres système",
        "📈 Rapports d'activité",
        "📞 Support technique",
        "💬 Assistance"
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

  const handleContactAction = (action: string) => {
    switch(action) {
      case "📞 Appeler AVS":
      case "📞 Appeler l'administration":
      case "📞 Support technique":
        window.location.href = "tel:+212524311982";
        toast.success("📞 Numéro: +212 5 24 31 19 82");
        break;
        
      case "💬 Contacter via WhatsApp":
      case "💬 Support technique":
        const whatsappMsg = encodeURIComponent("Bonjour, je souhaite obtenir plus d'informations sur AVS.");
        window.open(`https://wa.me/212662632953?text=${whatsappMsg}`, '_blank');
        break;
        
      case "📧 Envoyer un email":
        sendMessage("Je voudrais envoyer un email. Voici les contacts disponibles:\n\n" +
          "📩 Informations générales: info@avs.ma\n" +
          "📩 Admissions: admissions@avs.ma\n" +
          "📩 Carrières: careers@avs.ma\n" +
          "📩 Partenariats: partnerships@avs.ma");
        break;
        
      case "👤 Parler à un agent":
      case "💬 Assistance":
        sendMessage("Pour parler avec un agent en direct:\n\n" +
          "📞 Téléphone: +212 5 24 31 19 82\n" +
          "💬 WhatsApp: +212 6 62 63 29 53\n" +
          "📧 Email: info@avs.ma\n\n" +
          "Nos horaires: Lun-Ven 9h-18h");
        break;
        
      default:
        sendMessage(action);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleContactAction(reply);
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
          className="fixed right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg z-[100000] touch-manipulation active:scale-95 transition-transform"
          size="icon"
          aria-label="Ouvrir le chat assistant"
          style={{ bottom: 'max(env(safe-area-inset-bottom, 0px), 6rem)' }}
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed z-[100000] overflow-hidden flex flex-col min-h-0 inset-0 rounded-none sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 w-full h-[100dvh] sm:w-[min(90vw,24rem)] md:w-96 lg:w-[400px] sm:h-[min(85dvh,640px)] shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-5 duration-300 bg-card">
          {/* Header with curved wave */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-6 sm:pb-10 landscape:pb-4 safe-top">
            <div className="flex items-center justify-between p-3 sm:p-4 landscape:p-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center ring-2 ring-white/20">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-300 hidden xs:inline">Chat with</p>
                    {user && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30"
                      >
                        {getRoleName(displayRole)}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white">Assistant AVS</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-8 sm:w-8 text-white hover:bg-white/10 touch-manipulation active:scale-95 transition-transform"
                  aria-label="Fermer le chat"
                >
                  <X className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            <div className="px-3 sm:px-4 pb-2 sm:pb-4 landscape:pb-1 relative z-10">
              <p className="text-xs sm:text-sm text-gray-200">Nous sommes en ligne !</p>
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
          <ScrollArea className="flex-1 min-h-0 p-3 sm:p-4 landscape:p-2 bg-gray-50 dark:bg-gray-950 safe-bottom overscroll-contain">
            <div className="space-y-3 sm:space-y-4">
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
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">Suggestions rapides</p>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {getQuickReplies(displayRole).map((reply, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          variant="outline"
                          className="justify-start text-left h-auto py-2.5 sm:py-3 px-3 sm:px-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-normal text-gray-700 dark:text-gray-300 touch-manipulation active:scale-[0.98] transition-transform"
                        >
                          <span className="truncate">{reply}</span>
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
          <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 landscape:p-2 border-t bg-white dark:bg-gray-900 safe-bottom">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                className="min-h-[40px] sm:min-h-[50px] landscape:min-h-[36px] max-h-[100px] sm:max-h-[120px] resize-none rounded-2xl border-gray-200 dark:border-gray-700 text-sm sm:text-base touch-manipulation"
                disabled={isLoading}
                style={{ fontSize: '16px' }}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 landscape:h-9 landscape:w-9 rounded-full bg-blue-600 hover:bg-blue-700 shrink-0 touch-manipulation active:scale-95 transition-transform"
                aria-label="Envoyer le message"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
