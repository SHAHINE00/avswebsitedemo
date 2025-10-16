import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateStudentData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  academic_level?: string;
  previous_education?: string;
  career_goals?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_tag?: string;
}

export const useCreateStudent = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createStudent = async (studentData: CreateStudentData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-student', {
        body: studentData
      });

      // When edge function returns 400, data contains the error object
      if (data?.error) {
        throw new Error(data.error);
      }

      // Check for network/invocation errors
      if (error) {
        // For FunctionsHttpError, the message is already descriptive
        throw new Error(error.message || "Erreur lors de la création de l'étudiant");
      }

      // Check if we got a success response
      if (!data?.success) {
        throw new Error("Réponse inattendue du serveur");
      }

      toast({
        title: "Étudiant créé",
        description: `${studentData.full_name} a été créé avec succès`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'étudiant",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createStudent, loading };
};
