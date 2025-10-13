import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RevenueAnalytics {
  total_revenue: number;
  revenue_by_month: Array<{
    month: string;
    revenue: number;
    transaction_count: number;
  }>;
  revenue_by_course: Array<{
    course_name: string;
    revenue: number;
    payment_count: number;
  }>;
  revenue_by_method: Array<{
    payment_method: string;
    revenue: number;
    transaction_count: number;
  }>;
  average_payment: number;
}

export const useRevenueAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRevenueAnalytics = async (
    startDate?: string,
    endDate?: string
  ): Promise<RevenueAnalytics | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_revenue_analytics', {
        p_start_date: startDate,
        p_end_date: endDate,
      });

      if (error) throw error;
      return data as any as RevenueAnalytics;
    } catch (error: any) {
      console.error('Error fetching revenue analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de revenus",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getRevenueAnalytics, loading };
};
