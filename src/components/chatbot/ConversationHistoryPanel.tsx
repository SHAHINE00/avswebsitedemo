import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Trash2 } from 'lucide-react';

interface Conversation {
  id: string;
  title?: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface ConversationHistoryPanelProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
}

const ConversationHistoryPanel: React.FC<ConversationHistoryPanelProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button onClick={onNewConversation} className="w-full" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Nouvelle conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucune conversation pour le moment
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conv.title || 'Conversation sans titre'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(conv.updated_at)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationHistoryPanel;
