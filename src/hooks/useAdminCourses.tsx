
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Course } from '@/hooks/useCourses';

export const useAdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('display_order');

      if (error) {
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours",
          variant: "destructive",
        });
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

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

      await fetchAllCourses();
      return data;
    } catch (error) {
      console.error('Error creating course:', error);
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

      await fetchAllCourses();
    } catch (error) {
      console.error('Error updating course:', error);
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

      fetchAllCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      fetchAllCourses();
    }
  }, [user]);

  return {
    courses,
    loading,
    error,
    isAdmin,
    refetch: fetchAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
  };
};
