import { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  course_reminders: boolean;
  appointment_reminders: boolean;
  achievement_notifications: boolean;
  newsletter_subscription: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_title: string;
  achievement_description: string | null;
  achieved_at: string;
  metadata: any;
}

export interface UserStatistics {
  total_enrollments: number;
  completed_courses: number;
  active_courses: number;
  total_achievements: number;
  bookmarked_courses: number;
  avg_progress: number;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast({
        title: "Succès",
        description: "Préférences mises à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      if (error) throw error;
      
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  const fetchUserStatistics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_statistics', {
        p_user_id: user.id
      });

      if (error) throw error;
      
      setStatistics(data as unknown as UserStatistics);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
    }
  };

  const createAchievement = async (
    type: string,
    title: string,
    description?: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_title: title,
          achievement_description: description,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => [data, ...prev]);
      
      // Create notification for achievement
      await supabase.rpc('create_notification', {
        p_user_id: user.id,
        p_title: "Nouveau succès débloqué !",
        p_message: `Félicitations ! Vous avez débloqué : ${title}`,
        p_type: 'achievement'
      });

      toast({
        title: "🎉 Nouveau succès !",
        description: title,
      });

      return data;
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchUserPreferences(),
        fetchUserAchievements(),
        fetchUserStatistics()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  return {
    preferences,
    achievements,
    statistics,
    loading,
    updateUserPreferences,
    fetchUserPreferences,
    fetchUserAchievements,
    fetchUserStatistics,
    createAchievement,
  };
};