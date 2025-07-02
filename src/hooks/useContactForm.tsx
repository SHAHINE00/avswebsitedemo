
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      console.log('Submitting contact form:', formData);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      console.log('Contact form response:', { data, error });

      if (error) {
        console.error('Contact form error:', error);
        throw error;
      }

      toast({
        title: "Message envoyé !",
        description: "Nous avons bien reçu votre message et vous répondrons rapidement.",
      });

      return true;
    } catch (error) {
      console.error('Contact form submission error:', error);
      
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
