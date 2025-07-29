import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string;
  video_url: string | null;
  duration_minutes: number | null;
  lesson_order: number;
  is_preview: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number | null;
  download_count: number;
  is_public: boolean;
  created_at: string;
}

export interface CourseAnnouncement {
  id: string;
  course_id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_pinned: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completion_date: string | null;
  time_spent_minutes: number;
  last_accessed_at: string;
  created_at: string;
}

export const useCourseContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [announcements, setAnnouncements] = useState<CourseAnnouncement[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLessons = async (courseId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('lesson_order');

      if (error) throw error;
      setLessons((data as CourseLesson[]) || []);
    } catch (error) {
      logError('Error fetching lessons:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les leçons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      logError('Error fetching materials:', error);
    }
  };

  const fetchAnnouncements = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_announcements')
        .select('*')
        .eq('course_id', courseId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data as CourseAnnouncement[]) || []);
    } catch (error) {
      logError('Error fetching announcements:', error);
    }
  };

  const fetchUserProgress = async (courseId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select(`
          *,
          course_lessons!inner (course_id)
        `)
        .eq('user_id', user.id)
        .eq('course_lessons.course_id', courseId);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      logError('Error fetching progress:', error);
    }
  };

  const createLesson = async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([lessonData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Leçon créée avec succès",
      });

      return data;
    } catch (error) {
      logError('Error creating lesson:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la leçon",
        variant: "destructive",
      });
    }
  };

  const updateLesson = async (lessonId: string, updates: Partial<CourseLesson>) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .update(updates)
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Leçon mise à jour avec succès",
      });
    } catch (error) {
      logError('Error updating lesson:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la leçon",
        variant: "destructive",
      });
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Leçon supprimée avec succès",
      });
    } catch (error) {
      logError('Error deleting lesson:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la leçon",
        variant: "destructive",
      });
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          is_completed: true,
          completion_date: new Date().toISOString(),
          last_accessed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Félicitations!",
        description: "Leçon marquée comme terminée",
      });
    } catch (error) {
      logError('Error marking lesson complete:', error);
    }
  };

  const updateProgress = async (lessonId: string, timeSpent: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          time_spent_minutes: timeSpent,
          last_accessed_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logError('Error updating progress:', error);
    }
  };

  return {
    lessons,
    materials,
    announcements,
    progress,
    loading,
    fetchLessons,
    fetchMaterials,
    fetchAnnouncements,
    fetchUserProgress,
    createLesson,
    updateLesson,
    deleteLesson,
    markLessonComplete,
    updateProgress,
  };
};