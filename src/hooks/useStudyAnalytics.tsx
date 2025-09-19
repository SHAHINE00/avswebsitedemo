import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface StudyStats {
  totalHours: number;
  weeklyGoal: number;
  currentStreak: number;
  completionRate: number;
  averageSessionTime: number;
  lessonsCompleted: number;
  totalLessons: number;
  weeklyProgress: number[];
  monthlyProgress: { month: string; hours: number }[];
  subjectBreakdown: { subject: string; hours: number; percentage: number }[];
}

interface StudySession {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  type: 'lesson' | 'quiz' | 'review' | 'project';
  completed: boolean;
}

export const useStudyAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalHours: 0,
    weeklyGoal: 10,
    currentStreak: 0,
    completionRate: 0,
    averageSessionTime: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    weeklyProgress: [],
    monthlyProgress: [],
    subjectBreakdown: []
  });
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate study statistics
  const calculateStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user enrollments and progress
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            title,
            duration
          )
        `)
        .eq('user_id', user.id);

      if (enrollmentError) throw enrollmentError;

      // Get lesson progress
      const { data: lessonProgress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Calculate basic stats
      const completedLessons = lessonProgress?.filter(p => p.is_completed).length || 0;
      const totalLessons = lessonProgress?.length || 0;
      const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      // Calculate total study hours (from lesson progress time_spent_minutes)
      const totalMinutes = lessonProgress?.reduce((sum, lesson) => 
        sum + (lesson.time_spent_minutes || 0), 0) || 0;
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

      // Calculate average session time
      const sessionsCount = lessonProgress?.filter(p => p.time_spent_minutes > 0).length || 1;
      const averageSessionTime = Math.round(totalMinutes / sessionsCount);

      // Calculate current streak (consecutive days with activity)
      const currentStreak = await calculateStudyStreak();

      // Calculate weekly progress (last 7 days)
      const weeklyProgress = await calculateWeeklyProgress();

      // Calculate monthly progress (last 6 months)
      const monthlyProgress = await calculateMonthlyProgress();

      // Calculate subject breakdown
      const subjectBreakdown = await calculateSubjectBreakdown(enrollments);

      setStudyStats({
        totalHours,
        weeklyGoal: 10, // Default weekly goal
        currentStreak,
        completionRate,
        averageSessionTime,
        lessonsCompleted: completedLessons,
        totalLessons,
        weeklyProgress,
        monthlyProgress,
        subjectBreakdown
      });

    } catch (error) {
      console.error('Error calculating study stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques d'étude",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate study streak
  const calculateStudyStreak = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data: recentProgress, error } = await supabase
        .from('lesson_progress')
        .select('last_accessed_at')
        .eq('user_id', user.id)
        .not('last_accessed_at', 'is', null)
        .order('last_accessed_at', { ascending: false });

      if (error || !recentProgress) return 0;

      // Group by date and calculate consecutive days
      const studyDates = recentProgress
        .map(p => new Date(p.last_accessed_at!).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      // Check if studied today or yesterday
      if (studyDates[0] === today || studyDates[0] === yesterday) {
        streak = 1;
        
        // Count consecutive days
        for (let i = 1; i < studyDates.length; i++) {
          const currentDate = new Date(studyDates[i]);
          const previousDate = new Date(studyDates[i - 1]);
          const dayDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  // Calculate weekly progress (hours per day for last 7 days)
  const calculateWeeklyProgress = async (): Promise<number[]> => {
    if (!user) return Array(7).fill(0);

    try {
      const weeklyProgress = Array(7).fill(0);
      const { data: weeklyLessons, error } = await supabase
        .from('lesson_progress')
        .select('last_accessed_at, time_spent_minutes')
        .eq('user_id', user.id)
        .gte('last_accessed_at', new Date(Date.now() - 7 * 86400000).toISOString());

      if (error || !weeklyLessons) return weeklyProgress;

      weeklyLessons.forEach(lesson => {
        if (lesson.last_accessed_at && lesson.time_spent_minutes) {
          const dayIndex = Math.floor(
            (new Date().getTime() - new Date(lesson.last_accessed_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyProgress[6 - dayIndex] += lesson.time_spent_minutes / 60;
          }
        }
      });

      return weeklyProgress.map(hours => Math.round(hours * 10) / 10);
    } catch (error) {
      console.error('Error calculating weekly progress:', error);
      return Array(7).fill(0);
    }
  };

  // Calculate monthly progress
  const calculateMonthlyProgress = async (): Promise<{ month: string; hours: number }[]> => {
    if (!user) return [];

    try {
      const { data: monthlyLessons, error } = await supabase
        .from('lesson_progress')
        .select('last_accessed_at, time_spent_minutes')
        .eq('user_id', user.id)
        .gte('last_accessed_at', new Date(Date.now() - 6 * 30 * 86400000).toISOString());

      if (error || !monthlyLessons) return [];

      const monthlyData: { [key: string]: number } = {};
      
      monthlyLessons.forEach(lesson => {
        if (lesson.last_accessed_at && lesson.time_spent_minutes) {
          const month = new Date(lesson.last_accessed_at).toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: 'numeric' 
          });
          monthlyData[month] = (monthlyData[month] || 0) + lesson.time_spent_minutes / 60;
        }
      });

      return Object.entries(monthlyData)
        .map(([month, hours]) => ({ month, hours: Math.round(hours * 10) / 10 }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    } catch (error) {
      console.error('Error calculating monthly progress:', error);
      return [];
    }
  };

  // Calculate subject breakdown
  const calculateSubjectBreakdown = async (enrollments: any[]): Promise<{ subject: string; hours: number; percentage: number }[]> => {
    if (!enrollments || enrollments.length === 0) return [];

    const subjectHours: { [key: string]: number } = {};
    let totalHours = 0;

    for (const enrollment of enrollments) {
      const { data: lessons, error } = await supabase
        .from('lesson_progress')
        .select('time_spent_minutes')
        .eq('user_id', user?.id)
        .eq('lesson_id', enrollment.course_id); // This needs proper join with course_lessons

      if (!error && lessons) {
        const courseHours = lessons.reduce((sum, lesson) => 
          sum + (lesson.time_spent_minutes || 0), 0) / 60;
        
        const subject = enrollment.courses?.title || 'Autre';
        subjectHours[subject] = (subjectHours[subject] || 0) + courseHours;
        totalHours += courseHours;
      }
    }

    return Object.entries(subjectHours)
      .map(([subject, hours]) => ({
        subject,
        hours: Math.round(hours * 10) / 10,
        percentage: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  // Update weekly goal
  const updateWeeklyGoal = async (newGoal: number) => {
    setStudyStats(prev => ({ ...prev, weeklyGoal: newGoal }));
    
    // Save to user preferences
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          weekly_study_goal: newGoal
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Objectif mis à jour",
        description: `Votre objectif hebdomadaire est maintenant de ${newGoal} heures`
      });
    } catch (error) {
      console.error('Error updating weekly goal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'objectif",
        variant: "destructive"
      });
    }
  };

  // Track study session
  const trackStudySession = async (
    courseId: string, 
    lessonId: string, 
    duration: number, 
    type: StudySession['type'] = 'lesson'
  ) => {
    if (!user) return;

    try {
      // Update lesson progress
      const { error: progressError } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          time_spent_minutes: duration,
          last_accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (progressError) throw progressError;

      // Refresh stats
      await calculateStats();
    } catch (error) {
      console.error('Error tracking study session:', error);
    }
  };

  useEffect(() => {
    if (user) {
      calculateStats();
    }
  }, [user]);

  return {
    studyStats,
    sessions,
    loading,
    updateWeeklyGoal,
    trackStudySession,
    refreshStats: calculateStats
  };
};