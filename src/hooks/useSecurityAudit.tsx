import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError, logWarn } from '@/utils/logger';
import { performSecurityCheck } from '@/utils/security';

interface SecurityAuditEvent {
  id: string;
  action: string; // maps to event_type
  details: any; // includes severity and other data
  user_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

interface SecurityMetrics {
  total_events: number;
  critical_events: number;
  high_priority_events: number;
  recent_events: number;
  blocked_requests: number;
  failed_logins: number;
}

export const useSecurityAudit = () => {
  const [auditEvents, setAuditEvents] = useState<SecurityAuditEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log security event
  const logSecurityEvent = async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    userId?: string
  ) => {
    try {
      // Perform security check on the event data
      const securityCheck = performSecurityCheck({
        body: details,
        userId,
        action: eventType
      });

      if (!securityCheck) {
        logWarn('Security event blocked by security check');
        return;
      }

      // Insert security audit event using user_activity_logs table
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          action: eventType,
          details: {
            ...details,
            severity,
            event_type: eventType
          },
          user_id: userId,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });

      if (error) {
        logError('Failed to log security event:', error);
      } else {
        // Refresh audit events
        fetchAuditEvents();
      }
    } catch (err) {
      logError('Error logging security event:', err);
    }
  };

  // Get client IP (approximate)
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Fetch security audit events
  const fetchAuditEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditEvents((data || []) as SecurityAuditEvent[]);
    } catch (err) {
      logError('Error fetching security audit events:', err);
      setError('Failed to fetch security events');
    }
  };

  // Fetch security metrics
  const fetchMetrics = async () => {
    try {
      // Get basic metrics from audit events
      const { data: events, error } = await supabase
        .from('user_activity_logs')
        .select('details, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const now = Date.now();
      const dayAgo = now - 24 * 60 * 60 * 1000;

      const metrics: SecurityMetrics = {
        total_events: events?.length || 0,
        critical_events: events?.filter(e => (e.details as any)?.severity === 'critical').length || 0,
        high_priority_events: events?.filter(e => (e.details as any)?.severity === 'high').length || 0,
        recent_events: events?.filter(e => new Date(e.created_at).getTime() > dayAgo).length || 0,
        blocked_requests: 0, // Would be calculated from specific event types
        failed_logins: 0     // Would be calculated from auth events
      };

      setMetrics(metrics);
    } catch (err) {
      logError('Error fetching security metrics:', err);
    }
  };

  // Security monitoring functions
  const monitorLoginAttempt = async (success: boolean, email?: string) => {
    await logSecurityEvent(
      'login_attempt',
      success ? 'low' : 'medium',
      { success, email, timestamp: new Date().toISOString() }
    );
  };

  const monitorAdminAccess = async (userId: string, action: string, resource?: string) => {
    await logSecurityEvent(
      'admin_access',
      'high',
      { action, resource, timestamp: new Date().toISOString() },
      userId
    );
  };

  const monitorSuspiciousActivity = async (userId: string, activity: string, details: any) => {
    await logSecurityEvent(
      'suspicious_activity',
      'critical',
      { activity, details, timestamp: new Date().toISOString() },
      userId
    );
  };

  const monitorDataAccess = async (userId: string, table: string, operation: string) => {
    await logSecurityEvent(
      'data_access',
      'medium',
      { table, operation, timestamp: new Date().toISOString() },
      userId
    );
  };

  const monitorFileUpload = async (userId: string, fileName: string, fileSize: number) => {
    await logSecurityEvent(
      'file_upload',
      'low',
      { fileName, fileSize, timestamp: new Date().toISOString() },
      userId
    );
  };

  const monitorRateLimitExceeded = async (identifier: string, endpoint: string) => {
    await logSecurityEvent(
      'rate_limit_exceeded',
      'high',
      { identifier, endpoint, timestamp: new Date().toISOString() }
    );
  };

  // Initialize security monitoring
  useEffect(() => {
    const initializeSecurityAudit = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAuditEvents(),
          fetchMetrics()
        ]);
      } catch (err) {
        logError('Error initializing security audit:', err);
        setError('Failed to initialize security monitoring');
      } finally {
        setLoading(false);
      }
    };

    initializeSecurityAudit();
  }, []);

  // Set up real-time monitoring for new events
  useEffect(() => {
    const channel = supabase
      .channel('user_activity_logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_activity_logs'
      }, (payload) => {
        setAuditEvents(prev => [payload.new as SecurityAuditEvent, ...prev.slice(0, 99)]);
        fetchMetrics(); // Refresh metrics when new events arrive
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    auditEvents,
    metrics,
    loading,
    error,
    
    // Security monitoring functions
    monitorLoginAttempt,
    monitorAdminAccess,
    monitorSuspiciousActivity,
    monitorDataAccess,
    monitorFileUpload,
    monitorRateLimitExceeded,
    
    // Manual functions
    logSecurityEvent,
    refreshEvents: fetchAuditEvents,
    refreshMetrics: fetchMetrics
  };
};