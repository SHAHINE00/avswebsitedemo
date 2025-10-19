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
    console.log('🚀 [Client] Starting student creation...', {
      email: studentData.email,
      full_name: studentData.full_name
    });
    
    try {
      // Get fresh session to ensure valid auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ [Client] No valid session:', sessionError);
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('✅ [Client] Session valid, proceeding with student creation');
      
      const payload = { ...studentData, email: studentData.email.trim().toLowerCase() };
      console.log('📤 [Client] Invoking edge function with payload:', {
        ...payload,
        password: '[REDACTED]'
      });
      
      const { data, error } = await supabase.functions.invoke('admin-create-student', {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('📥 [Client] Edge function response:', {
        hasData: !!data,
        hasError: !!error,
        data,
        error
      });

      // When edge function returns 400, data contains the error object
      if (data?.error) {
        console.error('❌ [Client] Error in data:', data.error);
        throw new Error(data.error);
      }

      // Check for network/invocation errors
      if (error) {
        console.error('❌ [Client] Invocation error:', error);
        
        // Try to extract the real error message from the edge function response
        let errorMessage = (error as any)?.message || "Erreur lors de la création de l'étudiant";
        
        // Check for 404 - function not deployed
        if (errorMessage.includes('404') || errorMessage.includes('FunctionsRelayError')) {
          errorMessage = "La fonction Edge n'a pas été trouvée. Elle n'est peut-être pas déployée correctement.";
          console.error('❌ [Client] 404 Error - Edge function not found/deployed');
        }
        
        try {
          const response = (error as any)?.context?.response as Response | undefined;
          if (response) {
            const contentType = response.headers?.get?.('content-type') || '';
            if (contentType.includes('application/json')) {
              const body: any = await (response as any).json();
              errorMessage = body?.error || body?.message || errorMessage;
            } else {
              const text = await (response as any).text();
              if (text) errorMessage = text;
            }
          } else if ((error as any)?.context?.error) {
            // Some versions put error string directly under context.error
            errorMessage = (error as any).context.error;
          }
        } catch (_) {
          console.warn('⚠️ [Client] Failed to parse error response');
          // ignore parsing failures and fall back to default message
        }
        throw new Error(errorMessage);
      }

      // Check if we got a success response
      if (!data?.success) {
        console.error('❌ [Client] Unexpected server response:', data);
        throw new Error("Réponse inattendue du serveur");
      }

      const successMessage = data.created_new 
        ? `${studentData.full_name} a été créé avec succès` 
        : `${studentData.full_name} a été lié au compte existant`;
      
      console.log('✅ [Client] Student created successfully:', data);
      toast({
        title: "Étudiant créé",
        description: successMessage,
      });

      return data;
    } catch (error: any) {
      console.error('❌ [Client] Error creating student:', {
        message: error.message,
        stack: error.stack,
        fullError: error
      });
      
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
