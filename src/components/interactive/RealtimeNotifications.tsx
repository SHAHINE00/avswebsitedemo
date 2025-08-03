import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle, AlertCircle, Info, Award } from 'lucide-react';

interface NotificationData {
  id: string;
  type: 'course' | 'achievement' | 'system' | 'appointment';
  title: string;
  message: string;
  action_url?: string;
  created_at: string;
}

const RealtimeNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Award;
      case 'course':
        return Bell;
      case 'system':
        return Info;
      case 'appointment':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'default';
      case 'system':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const showNotificationToast = (notification: NotificationData) => {
    const Icon = getNotificationIcon(notification.type);
    const variant = getNotificationVariant(notification.type);

    toast({
      title: notification.title,
      description: notification.message,
      variant,
      action: notification.action_url ? (
        <button
          onClick={() => window.location.href = notification.action_url!}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Voir
        </button>
      ) : undefined,
    });
  };

  useEffect(() => {
    if (!user || isSubscribed) return;

    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new as NotificationData;
          showNotificationToast(notification);
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [user, isSubscribed, toast]);

  // Simulate some notifications for demo purposes
  useEffect(() => {
    if (!user) return;

    const simulateNotifications = () => {
      const demoNotifications: NotificationData[] = [
        {
          id: '1',
          type: 'course' as const,
          title: 'Nouvelle leçon disponible',
          message: 'Une nouvelle leçon a été ajoutée à votre formation en cours.',
          action_url: '/dashboard',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'achievement' as const,
          title: 'Nouveau badge débloqué !',
          message: 'Félicitations ! Vous avez débloqué le badge "Apprenant assidu".',
          action_url: '/dashboard?tab=achievements',
          created_at: new Date().toISOString()
        }
      ];

      // Show demo notifications after a delay
      setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance
          const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
          showNotificationToast(randomNotification);
        }
      }, 10000); // 10 seconds after component mounts
    };

    simulateNotifications();
  }, [user]);

  return null; // This component doesn't render anything visible
};

export default RealtimeNotifications;