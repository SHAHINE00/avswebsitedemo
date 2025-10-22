import React, { useState } from 'react';
import { Bot, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleFeedback = async (type: 'up' | 'down') => {
    setFeedback(type);
    
    // TODO: Uncomment after chat_feedback migration is run
    // try {
    //   await supabase.from('chat_feedback').insert({
    //     message_id: message.id,
    //     feedback_type: type,
    //   });
    // } catch (error) {
    //   console.error('Failed to save feedback:', error);
    // }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar - only show for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center ring-2 ring-primary/20 shadow-sm">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[85%] rounded-2xl p-5 shadow-md transition-all ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
            : 'bg-card text-card-foreground border border-border'
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="font-semibold text-current">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic opacity-90">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4 space-y-1 my-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-sm leading-relaxed">{children}</li>
              ),
              p: ({ children }) => (
                <p className="text-sm leading-loose mb-2 last:mb-0">{children}</p>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => {
                const code = children?.toString() || '';
                const isCopied = copiedCode === code;
                
                return (
                  <div className="relative group">
                    <pre className="bg-muted p-3 rounded-lg mt-2 overflow-x-auto text-xs">
                      {children}
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyCode(code)}
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              },
              h3: ({ children }) => (
                <h3 className="font-semibold text-base mt-3 mb-2">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="font-semibold text-sm mt-2 mb-1">{children}</h4>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Timestamp */}
          <time className={cn(
            "text-xs block mt-2",
            isUser 
              ? "text-primary-foreground/70" 
              : "text-muted-foreground"
          )}>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </time>
        </div>

        {/* Feedback buttons for assistant messages */}
        {!isUser && (
          <div className="flex gap-2 mt-3 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 text-xs",
                feedback === 'up' && "bg-green-100 dark:bg-green-900/20"
              )}
              onClick={() => handleFeedback('up')}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Utile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 text-xs",
                feedback === 'down' && "bg-red-100 dark:bg-red-900/20"
              )}
              onClick={() => handleFeedback('down')}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Pas utile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
