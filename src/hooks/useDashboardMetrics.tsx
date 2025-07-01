
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  archived_courses: number;
  total_users: number;
  total_admins: number;
  recent_users: number;
  recent_courses: number;
}

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_metrics');
      
      if (error) throw error;
      
      // Type assertion to ensure proper typing from Json to DashboardMetrics
      setMetrics(data as DashboardMetrics);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
};
