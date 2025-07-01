
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

export const useAdminActivityLogs = (limit = 10) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, entityType: string, entityId?: string, details?: any) => {
    try {
      await supabase.rpc('log_admin_activity', {
        p_action: action,
        p_entity_type: entityType,
        p_entity_id: entityId || null,
        p_details: details || null
      });
      
      // Refresh logs after logging new activity
      fetchLogs();
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [limit]);

  return { logs, loading, error, refetch: fetchLogs, logActivity };
};
