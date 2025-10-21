import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseClass {
  id: string;
  course_id: string;
  class_name: string;
  class_code?: string;
  professor_id?: string;
  max_students: number;
  current_students: number;
  academic_year?: string;
  semester?: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  course?: { title: string };
  professor?: { full_name: string; email: string };
}

export const useCourseClasses = (courseId?: string) => {
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchClasses = async (filterCourseId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('course_classes')
        .select(`
          *,
          course:courses(title),
          professor:professors(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (filterCourseId) {
        query = query.eq('course_id', filterCourseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setClasses((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(courseId);
  }, [courseId]);

  const createClass = async (classData: Partial<CourseClass>) => {
    try {
      const { error } = await supabase
        .from('course_classes')
        .insert([classData as any]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe créée avec succès",
      });

      await fetchClasses(courseId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la classe",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateClass = async (classId: string, updates: Partial<CourseClass>) => {
    try {
      const { error } = await supabase
        .from('course_classes')
        .update(updates)
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe mise à jour",
      });

      await fetchClasses(courseId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la classe",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteClass = async (classId: string) => {
    try {
      const { error } = await supabase
        .from('course_classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe supprimée",
      });

      await fetchClasses(courseId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la classe",
        variant: "destructive",
      });
      return false;
    }
  };

  const assignStudentsToClass = async (classId: string, studentIds: string[]) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ class_id: classId })
        .in('user_id', studentIds);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${studentIds.length} étudiant(s) assigné(s) à la classe`,
      });

      await fetchClasses(courseId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'assigner les étudiants",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    classes,
    loading,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    assignStudentsToClass,
  };
};
