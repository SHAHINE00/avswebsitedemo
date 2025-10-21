import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

interface BulkEnrollmentResult {
  success_count: number;
  failed_count: number;
  skipped_count?: number;
  errors?: Array<{ user_id: string; error: string }>;
}

export const useBulkEnrollments = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const bulkEnroll = async (userIds: string[], courseId: string): Promise<BulkEnrollmentResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('bulk_enroll_users', {
        p_user_ids: userIds,
        p_course_id: courseId
      });

      if (error) throw error;

      const result = data as unknown as BulkEnrollmentResult;
      
      if (result.success_count > 0) {
        toast({
          title: 'Inscriptions effectuées',
          description: `${result.success_count} utilisateur(s) inscrit(s) avec succès${
            result.skipped_count ? `, ${result.skipped_count} déjà inscrit(s)` : ''
          }${result.failed_count ? `, ${result.failed_count} échec(s)` : ''}`,
        });
      }

      if (result.failed_count > 0) {
        logError('Bulk enrollment errors:', result.errors);
        const errorDetails = result.errors && result.errors.length > 0
          ? `\n\nDétails: ${result.errors.map(e => e.error).join(', ')}`
          : '';
        toast({
          title: 'Erreurs détectées',
          description: `${result.failed_count} inscription(s) ont échoué${errorDetails}`,
          variant: 'destructive',
        });
      }

      return result;
    } catch (error) {
      logError('Bulk enroll error:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de l\'inscription groupée',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const bulkUnenroll = async (userIds: string[], courseId: string): Promise<BulkEnrollmentResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('bulk_unenroll_users', {
        p_user_ids: userIds,
        p_course_id: courseId
      });

      if (error) throw error;

      const result = data as unknown as BulkEnrollmentResult;
      
      if (result.success_count > 0) {
        toast({
          title: 'Désinscriptions effectuées',
          description: `${result.success_count} utilisateur(s) désinscrit(s) avec succès${
            result.skipped_count ? `, ${result.skipped_count} non inscrit(s)` : ''
          }${result.failed_count ? `, ${result.failed_count} échec(s)` : ''}`,
        });
      }

      if (result.failed_count > 0) {
        logError('Bulk unenrollment errors:', result.errors);
        const errorDetails = result.errors && result.errors.length > 0
          ? `\n\nDétails: ${result.errors.map(e => e.error).join(', ')}`
          : '';
        toast({
          title: 'Erreurs détectées',
          description: `${result.failed_count} désinscription(s) ont échoué${errorDetails}`,
          variant: 'destructive',
        });
      }

      return result;
    } catch (error) {
      logError('Bulk unenroll error:', error);
      toast({
        title: 'Erreur',
        description: 'Échec de la désinscription groupée',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { bulkEnroll, bulkUnenroll, loading };
};
