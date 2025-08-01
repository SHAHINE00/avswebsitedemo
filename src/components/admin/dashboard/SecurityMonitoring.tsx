import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Eye, Lock, Activity, FileX } from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { formatDistanceToNow } from 'date-fns';

const SecurityMonitoring: React.FC = () => {
  const { auditEvents, metrics, loading, error } = useSecurityAudit();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_attempt': return <Lock className="h-4 w-4" />;
      case 'admin_access': return <Shield className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'data_access': return <Eye className="h-4 w-4" />;
      case 'file_upload': return <FileX className="h-4 w-4" />;
      case 'rate_limit_exceeded': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading security monitoring data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events (30d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Security events tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics?.critical_events || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events (24h)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.recent_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Events in last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security events and alerts from your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No security events recorded
              </div>
            ) : (
              auditEvents.slice(0, 20).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getEventIcon(event.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        {event.action.replace(/_/g, ' ').toUpperCase()}
                      </h4>
                      <Badge variant={getSeverityColor((event.details as any)?.severity || 'unknown') as any}>
                        {(event.details as any)?.severity || 'unknown'}
                      </Badge>
                    </div>
                    
                    <div className="mt-1 text-sm text-muted-foreground">
                      {event.details && (
                        <div className="space-y-1">
                          {event.details.action && (
                            <div>Action: {event.details.action}</div>
                          )}
                          {event.details.resource && (
                            <div>Resource: {event.details.resource}</div>
                          )}
                          {event.details.table && (
                            <div>Table: {event.details.table}</div>
                          )}
                          {event.details.operation && (
                            <div>Operation: {event.details.operation}</div>
                          )}
                          {event.details.endpoint && (
                            <div>Endpoint: {event.details.endpoint}</div>
                          )}
                          {event.details.fileName && (
                            <div>File: {event.details.fileName}</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </span>
                      {event.user_id && (
                        <span>User: {event.user_id.slice(0, 8)}...</span>
                      )}
                      {event.ip_address && event.ip_address !== 'unknown' && (
                        <span>IP: {event.ip_address}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>
            Current security configuration and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Database Security</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Secured
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Authentication</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Rate Limiting</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Security Monitoring</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitoring;