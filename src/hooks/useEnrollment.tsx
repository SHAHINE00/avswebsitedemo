
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour vous inscrire à une formation.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('enroll_in_course', {
        p_course_id: courseId
      });

      if (error) {
        if (error.message.includes('Already enrolled')) {
          toast({
            title: "Déjà inscrit",
            description: "Vous êtes déjà inscrit à cette formation.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return false;
      }

      toast({
        title: "Inscription réussie !",
        description: "Vous êtes maintenant inscrit à cette formation.",
      });
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking enrollment:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }
  };

  return {
    enrollInCourse,
    checkEnrollmentStatus,
    loading,
  };
};
