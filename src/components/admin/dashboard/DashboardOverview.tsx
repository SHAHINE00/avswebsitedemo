
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, UserCheck, Clock, TrendingUp, Eye, Calendar, Activity } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardOverview = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { logs, loading: logsLoading } = useAdminActivityLogs(5);

  if (metricsLoading) {
    return <div className="flex items-center justify-center p-8">Chargement des métriques...</div>;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'course_created':
      case 'course_updated':
        return <BookOpen className="w-4 h-4" />;
      case 'user_promoted':
      case 'user_demoted':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'course_created':
        return 'bg-green-100 text-green-800';
      case 'course_updated':
        return 'bg-blue-100 text-blue-800';
      case 'user_promoted':
        return 'bg-purple-100 text-purple-800';
      case 'user_demoted':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Courses Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_courses || 0}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="text-xs">
                {metrics?.published_courses || 0} Publiés
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {metrics?.draft_courses || 0} Brouillons
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Users Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.recent_users || 0} ce mois
            </p>
          </CardContent>
        </Card>

        {/* Admins Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_admins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Équipe d'administration
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité Récente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.recent_courses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Nouveaux cours ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Cours</CardTitle>
            <CardDescription>Répartition par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Publiés</span>
                </div>
                <span className="text-sm font-medium">{metrics?.published_courses || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Brouillons</span>
                </div>
                <span className="text-sm font-medium">{metrics?.draft_courses || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Archivés</span>
                </div>
                <span className="text-sm font-medium">{metrics?.archived_courses || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Journal d'Activité</CardTitle>
            <CardDescription>Actions récentes des administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="text-sm text-muted-foreground">Chargement...</div>
            ) : logs.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucune activité récente</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`p-1 rounded-full ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.entity_type} - {formatDistanceToNow(new Date(log.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
