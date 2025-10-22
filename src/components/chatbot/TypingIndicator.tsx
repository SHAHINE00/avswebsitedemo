import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center ring-2 ring-primary/20 dark:ring-primary/30">
        <Bot className="h-5 w-5 text-white" />
      </div>

      {/* Typing animation */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm flex items-center gap-1">
        <div className="flex gap-1">
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
