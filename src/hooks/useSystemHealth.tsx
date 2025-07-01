
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  database_size: number;
  active_connections: number;
  table_stats: Record<string, { rows: number; size: number }>;
  last_updated: string;
  error?: string;
}

export const useSystemHealth = (refreshInterval = 30000) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemHealth = async () => {
    try {
      setError(null);
      console.log('Fetching system health...');
      
      const { data, error } = await supabase.rpc('get_system_health');
      
      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }
      
      console.log('System health data received:', data);
      
      // Handle the case where the function returns error info
      if (data && data.error) {
        console.warn('System health function returned error:', data.error);
        setError(`Database function error: ${data.error}`);
        // Still set the data with fallback values
        setHealth(data as SystemHealth);
      } else {
        setHealth(data as SystemHealth);
      }
    } catch (err) {
      console.error('Error fetching system health:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to fetch system health: ${errorMessage}`);
      
      // Set fallback data to prevent UI from breaking
      setHealth({
        database_size: 0,
        active_connections: 0,
        table_stats: {},
        last_updated: new Date().toISOString(),
        error: errorMessage
      });
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
