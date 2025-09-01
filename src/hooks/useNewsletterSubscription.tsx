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
      // Step 1: Save to database first
      const { error: dbError } = await supabase.functions.invoke('subscribe', {
        body: {
          email: data.email.trim(),
          full_name: data.fullName?.trim() || '',
          phone: data.phone?.trim() || '',
          formation_tag: data.interests?.join(', ') || '',
          source: data.source
        }
      });

      if (dbError) {
        console.error('Database subscription error:', dbError);
        // Continue with email anyway - user might already exist
      }

      // Step 2: Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'newsletter',
          email: data.email.trim(),
          fullName: data.fullName?.trim(),
          interests: data.interests,
          source: data.source
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        toast.error('Inscription enregistrée mais erreur d\'envoi de l\'email de bienvenue');
        return false;
      }

      toast.success('Inscription réussie ! Vérifiez votre boîte mail pour votre guide IA gratuit.');
      return true;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Erreur lors de l\'inscription à la newsletter');
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