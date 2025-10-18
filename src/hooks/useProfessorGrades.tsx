import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GradeRecord {
  grade_id: string;
  student_id: string;
  student_name: string;
  assignment_name: string;
  grade: number;
  max_grade: number;
  percentage: number;
  comment: string | null;
  graded_at: string;
}

export const useProfessorGrades = (courseId: string) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGrades = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_course_gradebook', {
        p_course_id: courseId
      });

      if (error) throw error;
      setGrades(data || []);
    } catch (error: any) {
      console.error('Error fetching grades:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase.rpc('get_grade_statistics', {
        p_course_id: courseId
      });

      if (error) throw error;
      setStats(data);
    } catch (error: any) {
      console.error('Error fetching grade stats:', error);
    }
  };

  const upsertGrade = async (
    studentId: string,
    assignmentName: string,
    grade: number,
    maxGrade: number = 100,
    comment?: string
  ) => {
    try {
      const { error } = await supabase.rpc('upsert_grade', {
        p_student_id: studentId,
        p_course_id: courseId,
        p_assignment_name: assignmentName,
        p_grade: grade,
        p_max_grade: maxGrade,
        p_comment: comment || null
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note enregistrée",
      });

      await fetchGrades();
      await fetchStats();
      return true;
    } catch (error: any) {
      console.error('Error upserting grade:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la note",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteGrade = async (gradeId: string) => {
    try {
      const { error } = await supabase.rpc('delete_grade_record', {
        p_grade_id: gradeId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note supprimée",
      });

      await fetchGrades();
      await fetchStats();
      return true;
    } catch (error: any) {
      console.error('Error deleting grade:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    grades,
    stats,
    loading,
    fetchGrades,
    fetchStats,
    upsertGrade,
    deleteGrade
  };
};
