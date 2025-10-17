import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Professor {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  photo_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useProfessors = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setProfessors(data || []);
    } catch (error: any) {
      console.error('Error fetching professors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les professeurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfessor = async (professor: Partial<Professor>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-professor', {
        body: {
          email: professor.email,
          full_name: professor.full_name,
          phone: professor.phone,
          specialization: professor.specialization,
          bio: professor.bio
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create professor');
      }

      toast({
        title: "Succès",
        description: data.message || "Professeur créé avec succès",
      });

      await fetchProfessors();
      return true;
    } catch (error: any) {
      console.error('Error creating professor:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfessor = async (id: string, updates: Partial<Professor>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('professors')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Professeur mis à jour avec succès",
      });

      await fetchProfessors();
      return true;
    } catch (error: any) {
      console.error('Error updating professor:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessor = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce professeur?')) {
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('professors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Professeur supprimé avec succès",
      });

      await fetchProfessors();
      return true;
    } catch (error: any) {
      console.error('Error deleting professor:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignToCourse = async (professorId: string, courseId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('admin_assign_professor_to_course', {
        p_professor_id: professorId,
        p_course_id: courseId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Professeur assigné au cours avec succès",
      });

      return true;
    } catch (error: any) {
      console.error('Error assigning professor:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'assignation",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  return {
    professors,
    loading,
    fetchProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    assignToCourse
  };
};