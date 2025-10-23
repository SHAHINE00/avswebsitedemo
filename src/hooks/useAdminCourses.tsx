
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { logError } from '@/utils/logger';
import type { Course } from '@/hooks/useCourses';

export const useAdminCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin status with React Query
  const { data: isAdmin = false } = useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      try {
        const { data, error } = await supabase.rpc('is_admin', {
          _user_id: user.id
        });

        if (error) {
          logError('Error checking admin status:', error);
          return false;
        }

        return data === true;
      } catch (error) {
        logError('Exception checking admin status:', error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData,
    retry: 2,
  });

  // Fetch all courses with React Query
  const { 
    data: courses = [], 
    isLoading: loading, 
    error: queryError 
  } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('display_order');

        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les cours",
            variant: "destructive",
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        logError('Exception fetching courses:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    retry: 2,
  });

  const error = queryError?.message || null;

  const createCourse = async (courseData: any) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le cours",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Succès",
        description: "Cours créé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      return data;
    } catch (error) {
      logError('Error creating course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseId: string, courseData: any) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', courseId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le cours",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Succès",
        description: "Cours mis à jour avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    } catch (error) {
      logError('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le cours",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Cours supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    } catch (error) {
      logError('Error deleting course:', error);
    }
  };

  return {
    courses,
    loading,
    error,
    isAdmin,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
    createCourse,
    updateCourse,
    deleteCourse
  };
};
