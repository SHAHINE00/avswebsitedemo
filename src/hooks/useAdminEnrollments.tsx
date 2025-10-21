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
  class_id?: string;
  class_name?: string;
  class_code?: string;
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
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          course_id,
          enrolled_at,
          progress_percentage,
          status,
          class_id,
          courses!inner(title),
          course_classes(class_name, class_code)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(enrollment => ({
        enrollment_id: enrollment.id,
        course_id: enrollment.course_id,
        course_title: enrollment.courses.title,
        enrolled_at: enrollment.enrolled_at,
        progress_percentage: enrollment.progress_percentage || 0,
        status: enrollment.status,
        class_id: enrollment.class_id || undefined,
        class_name: enrollment.course_classes?.class_name || undefined,
        class_code: enrollment.course_classes?.class_code || undefined,
      }));
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