
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackFormSubmission } from '@/utils/analytics';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitContactForm = async (formData: ContactFormData) => {
    setLoading(true);
    
    try {
      // Submit contact form to edge function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        // Contact form submission failed
        throw error;
      }

      // Track successful form submission
      trackFormSubmission('contact-form', 'contact', true);

      toast({
        title: "Message envoyé !",
        description: "Nous avons bien reçu votre message et vous répondrons rapidement.",
      });

      return true;
    } catch (error) {
      // Track failed form submission
      trackFormSubmission('contact-form', 'contact', false);
      
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContactForm,
    loading,
  };
};
