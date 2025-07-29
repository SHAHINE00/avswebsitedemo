
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

interface AnalyticsData {
  date: string;
  metric_type: string;
  metric_name: string;
  value: number;
  metadata: any;
}

export const useAdvancedAnalytics = (
  startDate: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: string = new Date().toISOString().split('T')[0],
  metricTypes: string[] | null = null
) => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: analyticsData, error } = await supabase.rpc('get_advanced_analytics', {
        p_start_date: startDate,
        p_end_date: endDate,
        p_metric_types: metricTypes
      });

      if (error) throw error;
      
      setData(analyticsData || []);
    } catch (err) {
      logError('Error fetching advanced analytics:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, JSON.stringify(metricTypes)]);

  return { data, loading, error, refetch: fetchAnalytics };
};
