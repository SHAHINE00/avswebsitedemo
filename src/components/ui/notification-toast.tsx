
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotificationToast = () => {
  const { toast } = useToast();

  const showNotificationToast = ({ type, title, description, action }: NotificationToastProps) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      info: Info,
      warning: AlertCircle
    };

    const Icon = icons[type];
    const variant = type === 'error' || type === 'warning' ? 'destructive' : 'default';

    toast({
      title,
      description,
      variant,
      action: action ? (
        <button
          onClick={action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {action.label}
        </button>
      ) : undefined,
    });
  };

  return { showNotificationToast };
};
