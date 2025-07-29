
import { logInfo, logError, logWarn } from '@/utils/logger';
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
      logInfo('Fetching system health...');
      
      const { data, error: rpcError } = await supabase.rpc('get_system_health');
      
      if (rpcError) {
        logError('Supabase RPC error:', rpcError);
        throw rpcError;
      }
      
      logInfo('System health data received:', data);
      
      // Safely handle the JSON response with proper type checking
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const response = data as Record<string, any>;
        
        // Handle the case where the function returns error info
        if (response.error) {
          logWarn('System health function returned error:', response.error);
          setError(`Database function error: ${response.error}`);
          
          // Set fallback data to prevent UI from breaking
          setHealth({
            database_size: response.database_size || 0,
            active_connections: response.active_connections || 0,
            table_stats: response.table_stats || {},
            last_updated: response.last_updated || new Date().toISOString(),
            error: response.error
          });
        } else {
          // Convert the response to SystemHealth interface
          setHealth({
            database_size: response.database_size || 0,
            active_connections: response.active_connections || 0,
            table_stats: response.table_stats || {},
            last_updated: response.last_updated || new Date().toISOString()
          });
        }
      } else {
        throw new Error('Invalid response format from system health function');
      }
    } catch (err) {
      logError('Error fetching system health:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Check if it's an authentication error
      if (errorMessage.includes('Access denied') || errorMessage.includes('Admin role required')) {
        setError('Admin access required to view system health metrics');
      } else {
        setError(`Failed to fetch system health: ${errorMessage}`);
      }
      
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
