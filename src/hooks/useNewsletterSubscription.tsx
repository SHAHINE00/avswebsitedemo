import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionData {
  email: string;
  fullName?: string;
  phone?: string;
  interests?: string[];
  source: string;
}

export const useNewsletterSubscription = () => {
  const [loading, setLoading] = useState(false);

  const subscribe = async (data: SubscriptionData) => {
    setLoading(true);
    
    try {
      console.log('Starting newsletter subscription for:', data.email);
      
      // Step 1: Save to database first - this must succeed
      const { data: dbResult, error: dbError } = await supabase.functions.invoke('subscribe', {
        body: {
          email: data.email.trim(),
          full_name: data.fullName?.trim() || '',
          phone: data.phone?.trim() || '',
          formation_tag: data.interests?.join(', ') || '',
          source: data.source
        }
      });

      console.log('Database subscription result:', { dbResult, dbError });

      if (dbError) {
        console.error('Database subscription failed:', dbError);
        toast.error('Erreur lors de l\'inscription à la newsletter. Veuillez réessayer.');
        return false;
      }

      // Check if already subscribed
      if (dbResult?.status === 'already_subscribed') {
        toast.success('Vous êtes déjà inscrit(e) à notre newsletter !');
        return true;
      }

      // Step 2: Send welcome email only if database save succeeded
      console.log('Sending welcome email...');
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'newsletter',
          email: data.email.trim(),
          fullName: data.fullName?.trim(),
          interests: data.interests,
          source: data.source
        }
      });

      console.log('Email sending result:', { emailResult, emailError });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        toast.error('Inscription enregistrée mais erreur d\'envoi de l\'email de bienvenue. Contactez le support.');
        return false;
      }

      toast.success('Inscription réussie ! Vérifiez votre boîte mail pour votre guide IA gratuit.');
      return true;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Erreur lors de l\'inscription à la newsletter. Veuillez réessayer.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    loading
  };
};