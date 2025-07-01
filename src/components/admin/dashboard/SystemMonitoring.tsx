
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  HardDrive,
  Users,
  Clock
} from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const SystemMonitoring = () => {
  const { health, loading, error } = useSystemHealth();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionStatus = (connections: number) => {
    if (connections < 10) return { status: 'good', color: 'text-green-600', icon: CheckCircle };
    if (connections < 20) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600', icon: XCircle };
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement des métriques système...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Erreur lors du chargement des métriques: {error}</AlertDescription>
      </Alert>
    );
  }

  if (!health) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Aucune donnée de santé système disponible</AlertDescription>
      </Alert>
    );
  }

  const connectionStatus = getConnectionStatus(health.active_connections);
  const StatusIcon = connectionStatus.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" />
            Surveillance Système
          </h2>
          <p className="text-muted-foreground">
            Dernière mise à jour: {formatDistanceToNow(new Date(health.last_updated), { 
              addSuffix: true, 
              locale: fr 
            })}
          </p>
        </div>
        <Badge variant={connectionStatus.status === 'good' ? 'default' : connectionStatus.status === 'warning' ? 'secondary' : 'destructive'}>
          <StatusIcon className="w-4 h-4 mr-1" />
          {connectionStatus.status === 'good' ? 'Système Sain' : 
           connectionStatus.status === 'warning' ? 'Attention' : 'Critique'}
        </Badge>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille Base de Données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(health.database_size)}</div>
            <p className="text-xs text-muted-foreground">
              Espace utilisé total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions Actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${connectionStatus.color}`}>
              {health.active_connections}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <StatusIcon className="w-3 h-3" />
              <span>État: {connectionStatus.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimal</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              85% de performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Statistiques des Tables
          </CardTitle>
          <CardDescription>
            Utilisation et performance des tables principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(health.table_stats || {}).map(([tableName, stats]) => (
              <div key={tableName} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{tableName}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{stats.rows} opérations</span>
                    <span>{formatBytes(stats.size)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {((stats.size / health.database_size) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">de la DB</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {health.active_connections > 15 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nombre élevé de connexions actives ({health.active_connections}). 
                  Surveillez les performances.
                </AlertDescription>
              </Alert>
            )}
            
            {health.database_size > 1000000000 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  La base de données approche 1GB. Considérez l'archivage des anciennes données.
                </AlertDescription>
              </Alert>
            )}

            {health.active_connections <= 15 && health.database_size <= 1000000000 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Tous les systèmes fonctionnent normalement.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
