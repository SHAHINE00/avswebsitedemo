import { useEffect, useRef } from 'react';
import { playNotificationSound } from '@/utils/chatbotUtils';

interface UseChatbotNotificationsProps {
  enabled: boolean;
  isOpen: boolean;
}

export const useChatbotNotifications = ({ enabled, isOpen }: UseChatbotNotificationsProps) => {
  const previousMessageCount = useRef(0);

  const notifyNewMessage = () => {
    if (!enabled || isOpen) return;

    // Play sound
    playNotificationSound();

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Assistant AVS', {
        body: 'Vous avez reçu une nouvelle réponse',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'chatbot-message'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return {
    notifyNewMessage,
    requestNotificationPermission
  };
};
