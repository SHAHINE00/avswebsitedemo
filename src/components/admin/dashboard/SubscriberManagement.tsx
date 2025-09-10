import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Download, FileText } from 'lucide-react';
import { useSubscriberManagement } from '@/hooks/useSubscriberManagement';
import { usePendingUsers } from '@/hooks/usePendingUsers';
import SubscriberTable from './subscriber-management/SubscriberTable';
import SubscriberAnalytics from './subscriber-management/SubscriberAnalytics';
import SubscriberFilters from './subscriber-management/SubscriberFilters';
import PendingUsersManagement from './PendingUsersManagement';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SubscriberManagement: React.FC = () => {
  const {
    subscribers,
    analytics,
    loading,
    error,
    filters,
    setFilters,
    deleteSubscriber,
    exportSubscribers
  } = useSubscriberManagement();

  const { pendingUsers, loading: pendingLoading } = usePendingUsers();

  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await exportSubscribers(format);
      toast({
        title: "Export réussi",
        description: `Les données ont été exportées au format ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (subscriberId: string) => {
    try {
      await deleteSubscriber(subscriberId);
      toast({
        title: "Abonné supprimé",
        description: "L'abonné a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer l'abonné",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Erreur: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Gestion des Abonnements</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez et analysez vos abonnements aux formations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 justify-center w-full sm:w-auto"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 justify-center w-full sm:w-auto"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export JSON</span>
            <span className="sm:hidden">JSON</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Total Abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? '...' : analytics?.total_subscribers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tous les abonnements
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Nouveaux (30j)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {loading ? '...' : analytics?.recent_subscribers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Derniers 30 jours
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Inscriptions en Attente</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {pendingLoading ? '...' : pendingUsers?.filter(u => u.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              À approuver/rejeter
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium truncate">Programme Populaire</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              {loading ? '...' : analytics?.popular_programs[0]?.program.slice(0, 10) + '...' || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.popular_programs[0]?.count || 0} abonnements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscribers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-full sm:max-w-2xl">
          <TabsTrigger value="subscribers" className="text-sm">
            <span className="hidden sm:inline">Abonnés</span>
            <span className="sm:hidden">Abo.</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm">
            <span className="hidden sm:inline">Inscriptions</span>
            <span className="sm:hidden">Insc.</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4 sm:space-y-6 mt-6">
          <SubscriberFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
          <div className="overflow-x-auto">
            <SubscriberTable
              subscribers={subscribers}
              loading={loading}
              onDelete={handleDelete}
            />
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PendingUsersManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <SubscriberAnalytics
            analytics={analytics}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriberManagement;