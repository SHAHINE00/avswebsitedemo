
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  database_size: number;
  active_connections: number;
  table_stats: Record<string, { rows: number; size: number }>;
  last_updated: string;
}

export const useSystemHealth = (refreshInterval = 30000) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemHealth = async () => {
    try {
      const { data, error } = await supabase.rpc('get_system_health');
      
      if (error) throw error;
      
      setHealth(data as unknown as SystemHealth);
    } catch (err) {
      console.error('Error fetching system health:', err);
      setError('Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
    
    const interval = setInterval(fetchSystemHealth, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { health, loading, error, refetch: fetchSystemHealth };
};
