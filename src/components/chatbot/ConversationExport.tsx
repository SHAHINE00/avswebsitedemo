import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationExportProps {
  conversationId: string;
  messages: Message[];
  title?: string;
}

const ConversationExport: React.FC<ConversationExportProps> = ({ 
  conversationId, 
  messages,
  title 
}) => {
  const { toast } = useToast();

  const exportAsJSON = () => {
    const data = {
      id: conversationId,
      title: title || 'Conversation sans titre',
      exportedAt: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Conversation exportée au format JSON"
    });
  };

  const exportAsText = () => {
    const text = messages.map(msg => {
      const time = msg.timestamp.toLocaleString('fr-FR');
      const sender = msg.role === 'user' ? 'Vous' : 'Assistant';
      return `[${time}] ${sender}:\n${msg.content}\n`;
    }).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Conversation exportée au format texte"
    });
  };

  const exportAsHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Conversation'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .message { margin: 20px 0; padding: 15px; border-radius: 10px; }
    .user { background: #e3f2fd; text-align: right; }
    .assistant { background: #f5f5f5; }
    .timestamp { font-size: 12px; color: #666; margin-bottom: 5px; }
    .content { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>${title || 'Conversation'}</h1>
  <p>Exportée le ${new Date().toLocaleString('fr-FR')}</p>
  ${messages.map(msg => `
    <div class="message ${msg.role}">
      <div class="timestamp">${msg.timestamp.toLocaleString('fr-FR')}</div>
      <div class="content">${msg.content.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Conversation exportée au format HTML"
    });
  };

  return (
    <div className="flex gap-2 p-3 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={exportAsJSON}
        className="flex-1"
      >
        <Download className="w-4 h-4 mr-2" />
        JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportAsText}
        className="flex-1"
      >
        <FileText className="w-4 h-4 mr-2" />
        TXT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportAsHTML}
        className="flex-1"
      >
        <Image className="w-4 h-4 mr-2" />
        HTML
      </Button>
    </div>
  );
};

export default ConversationExport;
