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

  // Calculate study statistics using backend function
  const calculateStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Use the backend function to get comprehensive statistics
      const { data: stats, error: statsError } = await supabase.rpc('get_study_statistics', {
        p_user_id: user.id
      });

      // If function doesn't exist (error code 42883), use fallback
      if (statsError && statsError.code === '42883') {
        console.log('get_study_statistics function not available, using fallback');
        // Continue with manual calculation below
      } else if (statsError) {
        throw statsError;
      }

      // Get study sessions for additional data
      const { data: studySessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (sessionsError) throw sessionsError;

      // Get user preferences for weekly goal
      const { data: preferences, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Calculate current streak using study sessions
      const currentStreak = await calculateStudyStreakFromSessions(studySessions || []);

      // Calculate weekly and monthly progress
      const weeklyProgress = await calculateWeeklyProgressFromSessions(studySessions || []);
      const monthlyProgress = await calculateMonthlyProgressFromSessions(studySessions || []);

      // Calculate subject breakdown from enrollments
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (title, duration)
        `)
        .eq('user_id', user.id);

      const subjectBreakdown = await calculateSubjectBreakdownFromSessions(studySessions || [], enrollments || []);

      // Calculate average session time
      const validSessions = studySessions?.filter(s => s.duration_minutes > 0) || [];
      const averageSessionTime = validSessions.length > 0 
        ? Math.round(validSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / validSessions.length)
        : 0;

      setStudyStats({
        totalHours: ((stats as any)?.total_study_hours) || 0,
        weeklyGoal: 10, // Will get from preferences if available
        currentStreak,
        completionRate: 0, // Will calculate from course enrollments
        averageSessionTime,
        lessonsCompleted: 0, // Will calculate from lesson progress
        totalLessons: 0, // Will calculate from available lessons
        weeklyProgress,
        monthlyProgress,
        subjectBreakdown
      });

      // Convert study sessions to the expected format
      const convertedSessions: StudySession[] = (studySessions || []).map(session => ({
        id: session.id,
        userId: session.user_id,
        courseId: session.course_id || '',
        lessonId: session.lesson_id || undefined,
        startTime: new Date(session.started_at),
        endTime: session.ended_at ? new Date(session.ended_at) : new Date(session.started_at),
        duration: session.duration_minutes,
        type: session.session_type as StudySession['type'],
        completed: true
      }));

      setSessions(convertedSessions);

    } catch (error) {
      console.warn('Error calculating study stats, using defaults:', error);
      // Set default values instead of showing error
      setStudyStats({
        totalHours: 0,
        weeklyGoal: 10,
        currentStreak: 0,
        completionRate: 0,
        averageSessionTime: 0,
        lessonsCompleted: 0,
        totalLessons: 0,
        weeklyProgress: Array(7).fill(0),
        monthlyProgress: [],
        subjectBreakdown: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate study streak from sessions
  const calculateStudyStreakFromSessions = async (sessions: any[]): Promise<number> => {
    if (!sessions || sessions.length === 0) return 0;

    try {
      // Group sessions by date
      const studyDates = sessions
        .map(s => new Date(s.started_at).toDateString())
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

  // Calculate weekly progress from study sessions
  const calculateWeeklyProgressFromSessions = async (sessions: any[]): Promise<number[]> => {
    const weeklyProgress = Array(7).fill(0);
    
    if (!sessions || sessions.length === 0) return weeklyProgress;

    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      
      sessions
        .filter(s => new Date(s.started_at) >= weekAgo)
        .forEach(session => {
          const dayIndex = Math.floor(
            (new Date().getTime() - new Date(session.started_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyProgress[6 - dayIndex] += session.duration_minutes / 60;
          }
        });

      return weeklyProgress.map(hours => Math.round(hours * 10) / 10);
    } catch (error) {
      console.error('Error calculating weekly progress:', error);
      return weeklyProgress;
    }
  };

  // Calculate monthly progress from study sessions
  const calculateMonthlyProgressFromSessions = async (sessions: any[]): Promise<{ month: string; hours: number }[]> => {
    if (!sessions || sessions.length === 0) return [];

    try {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 86400000);
      const monthlyData: { [key: string]: number } = {};
      
      sessions
        .filter(s => new Date(s.started_at) >= sixMonthsAgo)
        .forEach(session => {
          const month = new Date(session.started_at).toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: 'numeric' 
          });
          monthlyData[month] = (monthlyData[month] || 0) + session.duration_minutes / 60;
        });

      return Object.entries(monthlyData)
        .map(([month, hours]) => ({ month, hours: Math.round(hours * 10) / 10 }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    } catch (error) {
      console.error('Error calculating monthly progress:', error);
      return [];
    }
  };

  // Calculate subject breakdown from sessions and enrollments
  const calculateSubjectBreakdownFromSessions = async (sessions: any[], enrollments: any[]): Promise<{ subject: string; hours: number; percentage: number }[]> => {
    if (!sessions || sessions.length === 0 || !enrollments || enrollments.length === 0) return [];

    const subjectHours: { [key: string]: number } = {};
    let totalHours = 0;

    // Group sessions by course and match with enrollments
    sessions.forEach(session => {
      if (session.course_id) {
        const enrollment = enrollments.find(e => e.course_id === session.course_id);
        const subject = enrollment?.courses?.title || 'Autre';
        const hours = session.duration_minutes / 60;
        
        subjectHours[subject] = (subjectHours[subject] || 0) + hours;
        totalHours += hours;
      }
    });

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

  // Track study session using backend function
  const trackStudySession = async (
    courseId: string, 
    lessonId: string, 
    duration: number, 
    type: StudySession['type'] = 'lesson'
  ) => {
    if (!user) return;

    try {
      // Use the backend function to track study session
      const { error } = await supabase.rpc('track_study_session', {
        p_course_id: courseId,
        p_lesson_id: lessonId,
        p_duration_minutes: duration,
        p_session_type: type
      });

      if (error) throw error;

      // Refresh stats to get updated data
      await calculateStats();
    } catch (error) {
      console.error('Error tracking study session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session d'étude",
        variant: "destructive"
      });
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