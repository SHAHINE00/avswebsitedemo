import React, { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'course' | 'appointment' | 'achievement' | 'general';
  is_read: boolean;
  action_url: string | null;
  created_at: string;
  read_at: string | null;
  expires_at: string | null;
}

export const useNotifications = () => {
  // Add React null safety
  if (!React || !useState || !useEffect) {
    console.warn('useNotifications: React hooks not available');
    return {
      notifications: [],
      unreadCount: 0,
      loading: false,
      fetchNotifications: () => Promise.resolve(),
      markAsRead: () => Promise.resolve(),
      markAllAsRead: () => Promise.resolve(),
      createNotification: () => Promise.resolve(),
    };
  }

  let user, toast;
  try {
    ({ user } = useAuth());
    ({ toast } = useToast());
  } catch (error) {
    console.warn('useNotifications: hook dependencies failed:', error);
    return {
      notifications: [],
      unreadCount: 0,
      loading: false,
      fetchNotifications: () => Promise.resolve(),
      markAsRead: () => Promise.resolve(),
      markAllAsRead: () => Promise.resolve(),
      createNotification: () => Promise.resolve(),
    };
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications((data || []) as Notification[]);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      logError('Error fetching notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notificationId
      });

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      logError('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      logError('Error marking all notifications as read:', error);
    }
  };

  const createNotification = async (
    title: string, 
    message: string, 
    type: string = 'general',
    actionUrl?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: title,
        p_message: message,
        p_type: type,
        p_action_url: actionUrl
      });

      if (error) throw error;
      
      fetchNotifications(); // Refresh notifications
      return data;
    } catch (error) {
      logError('Error creating notification:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Set up real-time subscription for notifications
      const notificationChannel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast for new notification with improved styling
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: 5000,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => 
              prev.map(n => 
                n.id === updatedNotification.id ? updatedNotification : n
              )
            );
            // Update unread count based on current notifications
            setUnreadCount(prev => {
              const currentNotifications = notifications.map(n => 
                n.id === updatedNotification.id ? updatedNotification : n
              );
              return currentNotifications.filter(n => !n.is_read).length;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationChannel);
      };
    }
  }, [user, toast]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};