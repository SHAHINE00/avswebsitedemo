import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface UserEnrollment {
  enrollment_id: string;
  course_id: string;
  course_title: string;
  enrolled_at: string;
  progress_percentage: number;
  status: string;
}

export interface Course {
  id: string;
  title: string;
  status: string;
}

export const useAdminEnrollments = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, status')
        .eq('status', 'published')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getUserEnrollments = async (userId: string): Promise<UserEnrollment[]> => {
    try {
      const { data, error } = await supabase.rpc('get_user_enrollments_for_admin', {
        p_user_id: userId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      return [];
    }
  };

  const enrollUserInCourse = async (userId: string, courseId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_enroll_user_in_course', {
        p_user_id: userId,
        p_course_id: courseId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur inscrit au cours avec succès",
      });

      return true;
    } catch (error: any) {
      console.error('Error enrolling user:', error);
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

  const unenrollUserFromCourse = async (userId: string, courseId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('admin_unenroll_user_from_course', {
        p_user_id: userId,
        p_course_id: courseId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur désinscrit du cours avec succès",
      });

      return true;
    } catch (error: any) {
      console.error('Error unenrolling user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la désinscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    courses,
    getUserEnrollments,
    enrollUserInCourse,
    unenrollUserFromCourse,
    refetchCourses: fetchCourses
  };
};