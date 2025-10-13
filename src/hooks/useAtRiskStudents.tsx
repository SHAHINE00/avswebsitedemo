import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AtRiskStudent {
  user_id: string;
  full_name: string;
  email: string;
  risk_type: 'overdue_payment' | 'inactive' | 'stuck_on_lesson';
  risk_details: any;
  last_activity: string;
}

export const useAtRiskStudents = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAtRiskStudents = async (): Promise<AtRiskStudent[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_at_risk_students');

      if (error) throw error;
      return (data || []) as AtRiskStudent[];
    } catch (error: any) {
      console.error('Error fetching at-risk students:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étudiants à risque",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { getAtRiskStudents, loading };
};
