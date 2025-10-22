import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
              pre: ({ children }) => (
                <pre className="bg-muted p-3 rounded-lg mt-2 overflow-x-auto text-xs">
                  {children}
                </pre>
              ),
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
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
