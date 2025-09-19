import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  courseReminders: boolean;
  studyStreakAlerts: boolean;
  achievementNotifications: boolean;
  deadlineWarnings: boolean;
  weeklyProgressReports: boolean;
  appointmentReminders: boolean;
  newContentAlerts: boolean;
  studyRecommendations: boolean;
}

interface NotificationStatistics {
  notificationsThisWeek: number;
  readRate: number;
  actionsTaken: number;
  streakReminders: number;
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    courseReminders: true,
    studyStreakAlerts: true,
    achievementNotifications: true,
    deadlineWarnings: true,
    weeklyProgressReports: true,
    appointmentReminders: true,
    newContentAlerts: false,
    studyRecommendations: true
  });
  const [statistics, setStatistics] = useState<NotificationStatistics>({
    notificationsThisWeek: 0,
    readRate: 0,
    actionsTaken: 0,
    streakReminders: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Map database fields to our preferences interface
        const emailNotifs = data.email_notifications as any;
        const pushNotifs = data.push_notifications as any;
        
        setPreferences({
          courseReminders: emailNotifs?.course_updates ?? true,
          studyStreakAlerts: pushNotifs?.study_reminders ?? true,
          achievementNotifications: pushNotifs?.achievements ?? true,
          deadlineWarnings: emailNotifs?.goal_updates ?? true,
          weeklyProgressReports: emailNotifs?.study_reminders ?? true,
          appointmentReminders: emailNotifs?.certificates ?? true,
          newContentAlerts: emailNotifs?.course_updates ?? false,
          studyRecommendations: pushNotifs?.study_reminders ?? true
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les préférences de notification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!user) return;

    try {
      // Get notifications from this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weeklyNotifications, error: weeklyError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      if (weeklyError) throw weeklyError;

      // Calculate statistics
      const totalNotifications = weeklyNotifications?.length || 0;
      const readNotifications = weeklyNotifications?.filter(n => n.is_read)?.length || 0;
      const actionNotifications = weeklyNotifications?.filter(n => n.action_url && n.is_read)?.length || 0;
      const streakNotifications = weeklyNotifications?.filter(n => n.type === 'streak')?.length || 0;

      setStatistics({
        notificationsThisWeek: totalNotifications,
        readRate: totalNotifications > 0 ? Math.round((readNotifications / totalNotifications) * 100) : 0,
        actionsTaken: actionNotifications,
        streakReminders: streakNotifications
      });
    } catch (error) {
      console.error('Error fetching notification statistics:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      // Map our preferences interface to database fields
      const dbPreferences = {
        email_notifications: {
          course_updates: updatedPreferences.courseReminders || updatedPreferences.newContentAlerts,
          study_reminders: updatedPreferences.weeklyProgressReports,
          goal_updates: updatedPreferences.deadlineWarnings,
          certificates: updatedPreferences.appointmentReminders
        },
        push_notifications: {
          study_reminders: updatedPreferences.studyStreakAlerts || updatedPreferences.studyRecommendations,
          achievements: updatedPreferences.achievementNotifications,
          goal_updates: updatedPreferences.deadlineWarnings
        }
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...dbPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences de notification ont été mises à jour"
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSinglePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    await updatePreferences({ [key]: value });
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
      fetchStatistics();
    }
  }, [user]);

  return {
    preferences,
    statistics,
    loading,
    saving,
    updatePreferences,
    updateSinglePreference,
    refetchStatistics: fetchStatistics
  };
};