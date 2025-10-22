import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Upload, History, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChatbotAnalytics } from "@/hooks/useChatbotAnalytics";
import { useChatbotPersistence } from "@/hooks/useChatbotPersistence";
import { useChatbotLanguage } from "@/hooks/useChatbotLanguage";
import { useChatbotFileUpload } from "@/hooks/useChatbotFileUpload";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatbot = () => {
  const { user, isAdmin, isProfessor, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Enhanced hooks
  const { trackChatbotEvent } = useChatbotAnalytics();
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    saveMessage,
    loadMessages,
    deleteConversation
  } = useChatbotPersistence();
  const { language, changeLanguage, t } = useChatbotLanguage();
  const { uploadFile, uploading } = useChatbotFileUpload();

  const getDisplayRole = () => {
    if (!user) return 'visitor';
    if (isAdmin) return 'admin';
    if (isProfessor) return 'professor';
    if (isStudent) return 'student';
    return 'visitor';
  };

  const getRoleName = () => {
    const role = getDisplayRole();
    const roleNames = {
      visitor: 'Visiteur',
      student: 'Étudiant',
      professor: 'Professeur',
      admin: 'Administrateur',
    };
    return roleNames[role as keyof typeof roleNames] || 'Visiteur';
  };

  const getWelcomeMessage = () => {
    const role = getDisplayRole();
    const messages = {
      visitor: t.welcome,
      student: "👋 Bonjour Étudiant ! Je peux vous aider avec vos cours, notes, emploi du temps et toute question concernant votre parcours académique.",
      professor: "👋 Bonjour Professeur ! Je peux vous assister avec la gestion de vos cours, vos étudiants et les ressources pédagogiques.",
      admin: "👋 Bonjour Administrateur ! Je suis là pour vous guider dans la gestion de la plateforme, les utilisateurs et les paramètres système.",
    };
    return messages[role as keyof typeof messages] || t.welcome;
  };

  const getQuickReplies = () => {
    const role = getDisplayRole();
    const quickReplies = {
      visitor: [
        t.quickReplies.courses,
        t.quickReplies.fees,
        t.quickReplies.enroll,
        t.quickReplies.phone,
        t.quickReplies.whatsapp,
        t.quickReplies.email
      ],
      student: [
        "📅 Mon emploi du temps",
        "📊 Consulter mes notes",
        "📚 Ressources de cours",
        "💬 Contacter un professeur",
        t.quickReplies.phone,
        "👤 Parler à un agent"
      ],
      professor: [
        "👥 Gérer mes classes",
        "📝 Créer une évaluation",
        "📊 Statistiques des étudiants",
        "📚 Ressources pédagogiques",
        t.quickReplies.phone,
        "💬 Support technique"
      ],
      admin: [
        "👥 Gérer les utilisateurs",
        "📊 Tableau de bord",
        "⚙️ Paramètres système",
        "📈 Rapports d'activité",
        t.quickReplies.phone,
        "💬 Assistance"
      ]
    };
    return quickReplies[role as keyof typeof quickReplies] || quickReplies.visitor;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Track chatbot open/close
  useEffect(() => {
    if (isOpen) {
      trackChatbotEvent({ event_type: 'chatbot_opened', conversation_id: currentConversationId || undefined });
      if (!currentConversationId) {
        handleNewConversation();
      }
    } else {
      trackChatbotEvent({ event_type: 'chatbot_closed', conversation_id: currentConversationId || undefined });
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Load conversation when selected
  useEffect(() => {
    if (currentConversationId) {
      loadConversationMessages();
    }
  }, [currentConversationId]);

  const loadConversationMessages = async () => {
    if (!currentConversationId) return;
    const msgs = await loadMessages(currentConversationId);
    setMessages(msgs);
  };

  const handleNewConversation = async () => {
    const convId = await createConversation(language);
    if (convId) {
      setMessages([]);
      trackChatbotEvent({ event_type: 'conversation_started', conversation_id: convId });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentConversationId) return;

    const fileMessageContent = await uploadFile(file);
    if (fileMessageContent) {
      const fileMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: fileMessageContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fileMessage]);
      await saveMessage(currentConversationId, fileMessage);
      trackChatbotEvent({ 
        event_type: 'file_uploaded',
        conversation_id: currentConversationId,
        event_data: { fileName: file.name, fileType: file.type }
      });

      // Send file info to AI
      await streamChat(fileMessage);
    }
  };

  const streamChat = async (userMsg: Message) => {
    const CHAT_URL = 'https://nkkalmyhxtuisjdjmdew.supabase.co/functions/v1/ollama-chat';
    const startTime = Date.now();
    
    try {
      setIsLoading(true);
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMsg.content,
          sessionId: currentConversationId,
          visitorId: currentConversationId
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
        
        // Track error
        trackChatbotEvent({
          event_type: 'error',
          conversation_id: currentConversationId || undefined,
          event_data: {
            error_code: resp.status,
            error_message: errorData.message || errorData.error,
            request_id: errorData.requestId
          }
        });
        
        if (resp.status === 429) {
          toast({
            title: "Trop de requêtes",
            description: errorData.message || "Veuillez patienter quelques instants",
            variant: "destructive"
          });
        } else if (resp.status === 402) {
          toast({
            title: "Crédits insuffisants",
            description: errorData.message || "Contactez l'administrateur",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur",
            description: errorData.message || "Service AI temporairement indisponible",
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return;
      }

      // Handle JSON response from ollama-chat
      const responseData = await resp.json();
      const assistantId = crypto.randomUUID();
      const assistantContent = responseData.message;


      // Add assistant message to UI
      setMessages((prev) => [...prev, {
        id: assistantId,
        role: 'assistant' as const,
        content: assistantContent,
        timestamp: new Date(),
      }]);

      // Save assistant message
      if (currentConversationId && assistantContent) {
        await saveMessage(currentConversationId, {
          id: assistantId,
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date()
        });
        
        // Track performance
        const responseTime = Date.now() - startTime;
        trackChatbotEvent({
          event_type: 'response_received',
          conversation_id: currentConversationId,
          event_data: {
            response_time_ms: responseTime,
            response_length: assistantContent.length
          }
        });
      }

      setIsLoading(false);
    } catch (err) {
      const errorTime = Date.now() - startTime;
      console.error('Chat error:', err);
      
      // Track connection error
      trackChatbotEvent({
        event_type: 'connection_error',
        conversation_id: currentConversationId || undefined,
        event_data: {
          error: err instanceof Error ? err.message : 'Unknown error',
          duration_ms: errorTime
        }
      });
      
      toast({
        title: "Erreur",
        description: "Erreur de connexion au service AI",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading || !currentConversationId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Save to database
    await saveMessage(currentConversationId, userMessage);
    
    // Track analytics
    trackChatbotEvent({
      event_type: 'message_sent',
      conversation_id: currentConversationId,
      event_data: { messageLength: textToSend.length }
    });
    
    await streamChat(userMessage);
  };

  const handleContactAction = (action: string) => {
    trackChatbotEvent({
      event_type: 'contact_action',
      conversation_id: currentConversationId || undefined,
      event_data: { action }
    });

    if (action.includes("📞")) {
      window.location.href = "tel:+212524311982";
      toast({
        title: "📞 Numéro: +212 5 24 31 19 82"
      });
      return;
    }
    
    if (action.includes("💬") && action.includes("WhatsApp")) {
      const whatsappMsg = encodeURIComponent("Bonjour, je souhaite obtenir plus d'informations sur AVS.");
      window.open(`https://wa.me/212662632953?text=${whatsappMsg}`, '_blank');
      return;
    }
    
    if (action.includes("📧")) {
      sendMessage("Je voudrais envoyer un email. Voici les contacts disponibles:\n\n" +
        "📩 Informations générales: info@avs.ma\n" +
        "📩 Admissions: admissions@avs.ma\n" +
        "📩 Carrières: careers@avs.ma\n" +
        "📩 Partenariats: partnerships@avs.ma");
      return;
    }
    
    if (action.includes("👤") || action.includes("Assistance")) {
      sendMessage("Pour parler avec un agent en direct:\n\n" +
        "📞 Téléphone: +212 5 24 31 19 82\n" +
        "💬 WhatsApp: +212 6 62 63 29 53\n" +
        "📧 Email: info@avs.ma\n\n" +
        "Nos horaires: Lun-Ven 9h-18h");
      return;
    }
    
    sendMessage(action);
  };

  const handleQuickReply = (reply: string) => {
    trackChatbotEvent({
      event_type: 'quick_reply_clicked',
      conversation_id: currentConversationId || undefined,
      event_data: { reply }
    });
    handleContactAction(reply);
  };

  return (
    <div className="fixed bottom-0 right-0 z-[9999]">
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-full sm:w-[450px] h-[650px] max-h-[85vh] bg-background border rounded-lg shadow-2xl flex flex-col z-[9999] mx-4 sm:mx-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-academy-blue to-academy-purple">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-semibold text-white">Assistant AVS</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Nous sommes en ligne !
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-16 h-8 bg-white/20 border-white/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">🇫🇷 FR</SelectItem>
                  <SelectItem value="ar">🇲🇦 AR</SelectItem>
                  <SelectItem value="en">🇬🇧 EN</SelectItem>
                </SelectContent>
              </Select>

              {/* History Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <History className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showHistory ? (
            // History View
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{t.newChat}</h4>
                  <Button size="sm" onClick={handleNewConversation}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nouvelle
                  </Button>
                </div>
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      currentConversationId === conv.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => {
                      setCurrentConversationId(conv.id);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {conv.title || 'Sans titre'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Chat View
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{getWelcomeMessage()}</p>
                      </div>
                      
                      {/* Quick Replies */}
                      <div className="grid grid-cols-2 gap-2">
                        {getQuickReplies().map((reply, idx) => (
                          <Button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            variant="outline"
                            size="sm"
                            className="text-xs justify-start h-auto py-2"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}

                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      conversationId={currentConversationId || ''} 
                    />
                  ))}

                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || uploading}
                    className="shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={t.placeholder}
                    className="min-h-[44px] max-h-[120px] resize-none"
                    disabled={isLoading || !currentConversationId}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading || !currentConversationId}
                    size="icon"
                    className="shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {uploading && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Envoi du fichier...
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
