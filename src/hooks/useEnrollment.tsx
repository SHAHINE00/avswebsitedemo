
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { trackCourseEnrollment } from '@/utils/analytics';

export const useEnrollment = () => {
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const enrollInCourse = async (courseId: string, courseTitle?: string) => {
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
      logInfo('Starting enrollment for course:', courseId);
      
      const { data, error } = await supabase.rpc('enroll_in_course', {
        p_course_id: courseId
      });

      logInfo('Enrollment response:', { data, error });

      if (error) {
        logError('Enrollment error:', error);
        
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

      // Track enrollment in analytics
      trackCourseEnrollment(courseId, courseTitle || 'Unknown Course');

      toast({
        title: "Inscription réussie !",
        description: "Vous êtes maintenant inscrit à cette formation.",
      });
      
      logInfo('Enrollment successful');
      return true;
      
    } catch (error) {
      logError('Unexpected enrollment error:', error);
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

  const checkEnrollmentStatus = React.useCallback(async (courseId: string) => {
    if (!user) {
      logInfo('No user, returning false for enrollment check');
      return false;
    }

    try {
      logInfo('Checking enrollment status for course: ' + courseId + ' user: ' + user.id);
      
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      logInfo('Enrollment check response:', { data, error });

      if (error) {
        logError('Error checking enrollment:', error);
        return false;
      }

      const isEnrolled = !!data && data.status === 'active';
      logInfo('Is enrolled:', isEnrolled);
      return isEnrolled;
      
    } catch (error) {
      logError('Unexpected error checking enrollment status:', error);
      return false;
    }
  }, [user]);

  return {
    enrollInCourse,
    checkEnrollmentStatus,
    loading,
  };
};
