
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
      console.log('Starting enrollment for course:', courseId);
      
      const { data, error } = await supabase.rpc('enroll_in_course', {
        p_course_id: courseId
      });

      console.log('Enrollment response:', { data, error });

      if (error) {
        console.error('Enrollment error:', error);
        
        if (error.message.includes('Already enrolled') || error.message.includes('unique_violation')) {
          toast({
            title: "Déjà inscrit",
            description: "Vous êtes déjà inscrit à cette formation.",
            variant: "destructive",
          });
        } else if (error.message.includes('Authentication required')) {
          toast({
            title: "Authentification requise",
            description: "Vous devez être connecté pour vous inscrire.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur d'inscription",
            description: `Une erreur est survenue: ${error.message}`,
            variant: "destructive",
          });
        }
        return false;
      }

      toast({
        title: "Inscription réussie !",
        description: "Vous êtes maintenant inscrit à cette formation.",
      });
      
      console.log('Enrollment successful');
      return true;
      
    } catch (error) {
      console.error('Unexpected enrollment error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) {
      console.log('No user, returning false for enrollment check');
      return false;
    }

    try {
      console.log('Checking enrollment status for course:', courseId, 'user:', user.id);
      
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      console.log('Enrollment check response:', { data, error });

      if (error) {
        console.error('Error checking enrollment:', error);
        return false;
      }

      const isEnrolled = !!data && data.status === 'active';
      console.log('Is enrolled:', isEnrolled);
      return isEnrolled;
      
    } catch (error) {
      console.error('Unexpected error checking enrollment status:', error);
      return false;
    }
  };

  return {
    enrollInCourse,
    checkEnrollmentStatus,
    loading,
  };
};
