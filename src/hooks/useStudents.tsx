import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  formation_type?: string;
  formation_domaine?: string;
  student_status: string;
  created_at: string;
}

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const enrollInCourse = async (courseId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('enroll_in_course', {
        p_course_id: courseId
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit au cours",
      });

      return true;
    } catch (error: any) {
      console.error('Error enrolling:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'inscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getMyEnrollments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses:course_id (
            id,
            title,
            subtitle,
            icon,
            status,
            gradient_from,
            gradient_to
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos cours",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    enrollInCourse,
    getMyEnrollments
  };
};
