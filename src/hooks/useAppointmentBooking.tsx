
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { trackAppointmentBooking, trackFormSubmission } from '@/utils/analytics';

interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'phone' | 'video' | 'office';
  subject?: string;
  message?: string;
}

export const useAppointmentBooking = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const bookAppointment = async (appointmentData: AppointmentData) => {
    setLoading(true);
    
    try {
      logInfo('Booking appointment:', appointmentData);
      
      // Use the secure edge function for booking appointments
      const { data, error } = await supabase.functions.invoke('book-appointment', {
        body: { appointmentData }
      });

      logInfo('Appointment booking response:', { data, error });

      if (error) {
        logError('Appointment booking error:', error);
        throw error;
      }

      if (!data.success) {
        logError('Appointment booking failed:', data);
        throw new Error('Failed to book appointment');
      }

      // Track successful appointment booking
      trackAppointmentBooking(appointmentData.appointmentType);
      trackFormSubmission('appointment-form', 'appointment', true);

      toast({
        title: "Rendez-vous confirmé !",
        description: "Votre demande de rendez-vous a été enregistrée. Nous vous contacterons pour confirmer.",
      });

      return true;
    } catch (error) {
      // Track failed appointment booking
      trackFormSubmission('appointment-form', 'appointment', false);
      
      logError('Appointment booking error:', error);
      
      toast({
        title: "Erreur de réservation",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserAppointments = async () => {
    if (!user) return [];
    
    try {
      logInfo('Fetching user appointments for:', user.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      logInfo('User appointments response:', { data, error });

      if (error) {
        logError('Error fetching appointments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logError('Unexpected error fetching appointments:', error);
      return [];
    }
  };

  return {
    bookAppointment,
    getUserAppointments,
    loading,
  };
};
