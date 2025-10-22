import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail, Calendar, FileText, HelpCircle } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
  description?: string;
}

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions: QuickAction[] = [
    {
      icon: <Phone className="w-4 h-4" />,
      label: 'Appeler',
      action: '📞 Appeler AVS',
      description: 'Contactez-nous directement'
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: 'WhatsApp',
      action: '💬 Contacter via WhatsApp',
      description: 'Chat en direct'
    },
    {
      icon: <Mail className="w-4 h-4" />,
      label: 'Email',
      action: '📧 Envoyer un email',
      description: 'Envoyez-nous un message'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Rendez-vous',
      action: 'Prendre un rendez-vous',
      description: 'Planifiez une réunion'
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Formations',
      action: '📚 Quelles sont les formations disponibles ?',
      description: 'Découvrez nos cours'
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: 'Aide',
      action: '👤 Parler à un agent',
      description: 'Assistance personnalisée'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onActionClick(action.action)}
          className="h-auto flex-col items-center justify-center p-3 space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {action.icon}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">{action.label}</p>
            {action.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {action.description}
              </p>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
