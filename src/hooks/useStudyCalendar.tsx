import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  title: string;
  course: string;
  date: Date;
  startTime: string;
  duration: number;
  type: 'lesson' | 'quiz' | 'review' | 'project';
  completed: boolean;
  reminder: boolean;
  course_id?: string;
  lesson_id?: string;
}

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: 'hours' | 'lessons' | 'courses';
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  goal_type: string;
}

export const useStudyCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch study sessions from backend
  const fetchStudySessions = async () => {
    if (!user) return;

    try {
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*, courses(title)')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;

      // Convert backend sessions to frontend format
      const convertedSessions: StudySession[] = (sessions || []).map(session => {
        const metadata = session.metadata as any;
        const courses = (session as any).courses;
        return {
          id: session.id,
          title: metadata?.custom_title || `Session ${session.session_type}`,
          course: courses?.title || 'Formation',
          date: new Date(session.started_at),
          startTime: new Date(session.started_at).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duration: session.duration_minutes,
          type: session.session_type as StudySession['type'],
          completed: !!session.ended_at,
          reminder: metadata?.reminder || false,
          course_id: session.course_id,
          lesson_id: session.lesson_id
        };
      });

      setStudySessions(convertedSessions);
    } catch (error) {
      console.error('Error fetching study sessions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions d'étude",
        variant: "destructive"
      });
    }
  };

  // Fetch study goals from backend
  const fetchStudyGoals = async () => {
    if (!user) return;

    try {
      const { data: goals, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert backend goals to frontend format
      const convertedGoals: StudyGoal[] = (goals || []).map(goal => {
        const metadata = (goal as any).metadata;
        return {
          id: goal.id,
          title: metadata?.custom_title || `Objectif ${goal.goal_type}`,
          target: goal.target_value,
          current: goal.current_value,
          unit: goal.goal_type === 'weekly_hours' || goal.goal_type === 'monthly_hours' ? 'hours' : 'lessons',
          deadline: new Date(goal.period_end),
          priority: 'medium' as const,
          status: goal.status as StudyGoal['status'],
          goal_type: goal.goal_type
        };
      });

      setStudyGoals(convertedGoals);
    } catch (error) {
      console.error('Error fetching study goals:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les objectifs d'étude",
        variant: "destructive"
      });
    }
  };

  // Create new study session
  const createStudySession = async (sessionData: {
    title: string;
    course_id: string;
    lesson_id?: string;
    date: Date;
    startTime: string;
    duration: number;
    type: StudySession['type'];
  }) => {
    if (!user) return;

    try {
      // Combine date and time with proper timezone handling
      const [hours, minutes] = sessionData.startTime.split(':');
      const startDateTime = new Date(sessionData.date);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Insert directly with planned date/time and custom title
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          course_id: sessionData.course_id,
          lesson_id: sessionData.lesson_id,
          session_type: sessionData.type,
          duration_minutes: sessionData.duration,
          started_at: startDateTime.toISOString(),
          ended_at: null, // null = planned session
          metadata: {
            custom_title: sessionData.title,
            planned: true
          }
        });

      if (error) throw error;

      toast({
        title: "Session créée",
        description: "Votre session d'étude a été planifiée avec succès"
      });

      // Refresh sessions
      await fetchStudySessions();
    } catch (error) {
      console.error('Error creating study session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session d'étude",
        variant: "destructive"
      });
    }
  };

  // Create new study goal
  const createStudyGoal = async (goalData: {
    title: string;
    target: number;
    goalType: string;
    deadline: Date;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_goals')
        .insert({
          user_id: user.id,
          goal_type: goalData.goalType,
          target_value: goalData.target,
          current_value: 0,
          period_start: new Date().toISOString().split('T')[0],
          period_end: goalData.deadline.toISOString().split('T')[0],
          status: 'active',
          metadata: {
            custom_title: goalData.title
          }
        });

      if (error) throw error;

      toast({
        title: "Objectif créé",
        description: "Votre objectif d'étude a été créé avec succès"
      });

      // Refresh goals
      await fetchStudyGoals();
    } catch (error) {
      console.error('Error creating study goal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'objectif d'étude",
        variant: "destructive"
      });
    }
  };

  // Update study goal
  const updateStudyGoal = async (goalId: string, updates: Partial<StudyGoal>) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_study_goal', {
        p_goal_id: goalId,
        p_target_value: updates.target
      });

      if (error) throw error;

      toast({
        title: "Objectif mis à jour",
        description: "Votre objectif a été modifié avec succès"
      });

      // Refresh goals
      await fetchStudyGoals();
    } catch (error) {
      console.error('Error updating study goal:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'objectif",
        variant: "destructive"
      });
    }
  };

  // Initialize data
  const initializeData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchStudySessions(),
        fetchStudyGoals()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  return {
    studySessions,
    studyGoals,
    loading,
    createStudySession,
    createStudyGoal,
    updateStudyGoal,
    refreshData: initializeData
  };
};