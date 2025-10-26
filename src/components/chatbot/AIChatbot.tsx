import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Upload, History, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { NavigationButtons, parseNavigationActions } from "./NavigationButtons";
import { QuickActionButtons } from "./QuickActionButtons";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChatbotAnalytics } from "@/hooks/useChatbotAnalytics";
import { useChatbotPersistence } from "@/hooks/useChatbotPersistence";
import { useChatbotLanguage, type SupportedLanguage } from "@/hooks/useChatbotLanguage";
import { useChatbotFileUpload } from "@/hooks/useChatbotFileUpload";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  navigationActions?: Array<{ label: string; path: string }>;
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
      student: t.welcomeStudent,
      professor: t.welcomeProfessor,
      admin: t.welcomeAdmin,
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
        t.quickReplies.studentSchedule,
        t.quickReplies.studentGrades,
        t.quickReplies.studentResources,
        t.quickReplies.studentContact,
        t.quickReplies.phone,
        t.quickReplies.studentAgent
      ],
      professor: [
        t.quickReplies.profClasses,
        t.quickReplies.profEvaluation,
        t.quickReplies.profStats,
        t.quickReplies.profResources,
        t.quickReplies.phone,
        t.quickReplies.profSupport
      ],
      admin: [
        t.quickReplies.adminUsers,
        t.quickReplies.adminDashboard,
        t.quickReplies.adminSettings,
        t.quickReplies.adminReports,
        t.quickReplies.phone,
        t.quickReplies.adminAssistance
      ]
    };
    return quickReplies[role as keyof typeof quickReplies] || quickReplies.visitor;
  };

  const getOnlineStatusText = () => {
    if (language === 'en') return "We're online!";
    if (language === 'ar') return 'نحن متصلون!';
    return 'Nous sommes en ligne !';
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
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ollama-chat`;
    const startTime = Date.now();
    
    try {
      setIsLoading(true);
      
      // Convert messages to API format
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      apiMessages.push({ role: userMsg.role, content: userMsg.content });
      
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          language: language,
          conversationId: currentConversationId
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
        
        trackChatbotEvent({
          event_type: 'error',
          conversation_id: currentConversationId || undefined,
          event_data: {
            error_code: resp.status,
            error_message: errorData.message || errorData.error
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

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      const assistantId = crypto.randomUUID();
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id === assistantId) {
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
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse navigation actions from assistant response
      const navigationActions = parseNavigationActions(assistantContent);
      
      // Update message with navigation actions
      if (navigationActions.length > 0) {
        setMessages((prev) => 
          prev.map((m) => 
            m.id === assistantId ? { ...m, navigationActions } : m
          )
        );
      }

      // Save assistant message
      if (currentConversationId && assistantContent) {
        await saveMessage(currentConversationId, {
          id: assistantId,
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date()
        });
        
        const responseTime = Date.now() - startTime;
        trackChatbotEvent({
          event_type: 'response_received',
          conversation_id: currentConversationId,
          event_data: {
            response_time_ms: responseTime,
            response_length: assistantContent.length,
            has_navigation: navigationActions.length > 0
          }
        });
      }

      setIsLoading(false);
    } catch (err) {
      const errorTime = Date.now() - startTime;
      console.error('Chat error:', err);
      
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
    
    if (action.toLowerCase().includes("whatsapp")) {
      const number = "212662632953"; // country code + number, digits only
      const msg = "Bonjour, je souhaite obtenir plus d'informations sur AVS.";
      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(msg.slice(0, 500))}`;

      try {
        // Navigate in the same tab for better reliability (avoids pop-up blockers)
        window.location.href = whatsappUrl;
      } catch {
        // Fallback: simulate a trusted anchor click
        const a = document.createElement('a');
        a.href = whatsappUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      toast({
        title: "💬 WhatsApp",
        description: "Ouverture de WhatsApp... Numéro: +212 6 62 63 29 53"
      });
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

  const handleLanguageChange = async (newLanguage: string) => {
    // Validate language
    if (!['fr', 'ar', 'en'].includes(newLanguage)) return;
    
    // Change language in localStorage
    changeLanguage(newLanguage as 'fr' | 'ar' | 'en');
    
    // Create new conversation with new language
    const convId = await createConversation(newLanguage);
    if (convId) {
      setMessages([]);
      trackChatbotEvent({ 
        event_type: 'conversation_started', 
        conversation_id: convId,
        event_data: { language_changed: true, from: language, to: newLanguage }
      });
      
      // Show toast in the new language
      const languageNames: Record<string, string> = {
        fr: 'Français',
        en: 'English',
        ar: 'العربية'
      };
      
      toast({
        title: `🌐 ${newLanguage === 'fr' ? 'Langue changée en' : newLanguage === 'en' ? 'Language changed to' : 'تم تغيير اللغة إلى'} ${languageNames[newLanguage]}`,
        description: newLanguage === 'fr' 
          ? 'Nouvelle conversation démarrée' 
          : newLanguage === 'en' 
          ? 'New conversation started' 
          : 'تم بدء محادثة جديدة'
      });
    }
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
        <div className="fixed bottom-24 left-4 right-4 sm:right-6 sm:left-auto w-auto sm:w-[450px] h-[80vh] sm:h-[650px] max-h-[90vh] bg-background border rounded-lg shadow-2xl flex flex-col z-[9999]">
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
                  {getOnlineStatusText()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger title="Changer de langue / Change language" className="w-24 h-10 sm:w-28 sm:h-12 bg-white/20 border-white/30 text-white text-xl sm:text-2xl leading-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[10000] bg-background text-foreground border border-border shadow-lg">
                  <SelectItem value="fr" className="text-2xl leading-none">🇫🇷 FR</SelectItem>
                  <SelectItem value="ar" className="text-2xl leading-none">🇲🇦 AR</SelectItem>
                  <SelectItem value="en" className="text-2xl leading-none">🇬🇧 EN</SelectItem>
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
                      
                      {/* Quick Action Buttons */}
                      <QuickActionButtons userRole={getDisplayRole()} />
                      
                      {/* Quick Replies */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
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
                    <div key={message.id}>
                      <ChatMessage 
                        message={message} 
                        conversationId={currentConversationId || ''} 
                      />
                      {message.role === 'assistant' && message.navigationActions && message.navigationActions.length > 0 && (
                        <NavigationButtons actions={message.navigationActions} />
                      )}
                    </div>
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
