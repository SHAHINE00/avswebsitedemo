import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface NewsletterData {
  email: string;
  fullName?: string;
  interests?: string[];
  source?: string;
}

interface CustomEmailData {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export const useHostingerEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendContactEmail = async (formData: ContactFormData) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'contact',
          ...formData
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message envoyé !",
        description: "Nous avons bien reçu votre message et vous répondrons rapidement.",
      });

      return true;
    } catch (error) {
      logError('Contact email error:', error);
      
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

  const sendNewsletterWelcome = async (data: NewsletterData) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'newsletter',
          ...data
        }
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      logError('Newsletter email error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendCustomEmail = async (data: CustomEmailData) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'custom',
          ...data
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé !",
        description: `Message envoyé avec succès à ${data.to.length} destinataire(s).`,
      });

      return true;
    } catch (error) {
      logError('Custom email error:', error);
      
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async (
    subscribers: string[], 
    subject: string, 
    htmlContent: string,
    campaignId?: string
  ) => {
    setLoading(true);
    
    try {
      // Split into batches to avoid overwhelming the system
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < subscribers.length; i += batchSize) {
        batches.push(subscribers.slice(i, i + batchSize));
      }

      let totalSent = 0;
      let totalErrors = 0;

      for (const batch of batches) {
        try {
          const { error } = await supabase.functions.invoke('send-hostinger-email', {
            body: {
              type: 'custom',
              to: batch,
              subject,
              html: htmlContent
            }
          });

          if (error) {
            totalErrors += batch.length;
          } else {
            totalSent += batch.length;
          }

          // Update campaign stats if campaignId provided
          if (campaignId) {
            await supabase
              .from('email_campaigns')
              .update({
                total_sent: totalSent,
                status: totalErrors === 0 ? 'sent' : 'sending'
              })
              .eq('id', campaignId);
          }

          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (batchError) {
          logError('Batch sending error:', batchError);
          totalErrors += batch.length;
        }
      }

      toast({
        title: "Envoi terminé",
        description: `${totalSent} emails envoyés avec succès${totalErrors > 0 ? `, ${totalErrors} erreurs` : ''}.`,
        variant: totalErrors === 0 ? "default" : "destructive"
      });

      return { sent: totalSent, errors: totalErrors };
    } catch (error) {
      logError('Bulk email error:', error);
      
      toast({
        title: "Erreur d'envoi groupé",
        description: "Une erreur est survenue lors de l'envoi des emails.",
        variant: "destructive",
      });
      
      return { sent: 0, errors: subscribers.length };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendContactEmail,
    sendNewsletterWelcome,
    sendCustomEmail,
    sendBulkEmail,
    loading,
  };
};