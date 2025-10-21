import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
        <Bot className="h-4 w-4 text-white" />
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
