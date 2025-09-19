import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export const useRealTimeData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const setupRealTimeSubscriptions = useCallback(() => {
    if (!user) return null;

    // Combined real-time channel for all user data
    const channel = supabase
      .channel('user-data-updates')
      
      // Study sessions updates
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'study_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Dispatch custom event for study session updates
          window.dispatchEvent(new CustomEvent('studySessionUpdate', {
            detail: { type: 'insert', data: payload.new }
          }));
        }
      )
      
      // Course enrollments updates
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'course_enrollments',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          window.dispatchEvent(new CustomEvent('enrollmentUpdate', {
            detail: { type: 'insert', data: payload.new }
          }));
          
          toast({
            title: "Nouvelle inscription!",
            description: "Vous êtes maintenant inscrit à un nouveau cours.",
            duration: 4000,
          });
        }
      )
      
      // Course enrollments progress updates
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'course_enrollments',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          window.dispatchEvent(new CustomEvent('enrollmentUpdate', {
            detail: { type: 'update', data: payload.new }
          }));
        }
      )
      
      // Achievements updates
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          window.dispatchEvent(new CustomEvent('achievementUpdate', {
            detail: { type: 'insert', data: payload.new }
          }));
          
          const achievement = payload.new as any;
          toast({
            title: "🏆 Nouveau succès débloqué!",
            description: achievement.achievement_title,
            duration: 6000,
          });
        }
      )
      
      // Course bookmarks updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          window.dispatchEvent(new CustomEvent('bookmarkUpdate', {
            detail: { type: payload.eventType, data: payload.new || payload.old }
          }));
        }
      )
      
      // Certificates updates
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'certificates',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          window.dispatchEvent(new CustomEvent('certificateUpdate', {
            detail: { type: 'insert', data: payload.new }
          }));
          
          const certificate = payload.new as any;
          toast({
            title: "📜 Nouveau certificat obtenu!",
            description: certificate.title,
            duration: 8000,
          });
        }
      )
      
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscriptions established');
        } else if (status === 'CHANNEL_ERROR') {
          logError('Real-time subscription error');
        }
      });

    return channel;
  }, [user, toast]);

  useEffect(() => {
    const channel = setupRealTimeSubscriptions();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [setupRealTimeSubscriptions]);

  return {
    setupRealTimeSubscriptions
  };
};