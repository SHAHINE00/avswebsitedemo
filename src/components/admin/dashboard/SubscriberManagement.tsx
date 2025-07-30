import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Download } from 'lucide-react';
import { useSubscriberManagement } from '@/hooks/useSubscriberManagement';
import SubscriberTable from './subscriber-management/SubscriberTable';
import SubscriberAnalytics from './subscriber-management/SubscriberAnalytics';
import SubscriberFilters from './subscriber-management/SubscriberFilters';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Abonnements</h1>
          <p className="text-muted-foreground">
            Gérez et analysez vos abonnements aux formations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : analytics?.total_subscribers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tous les abonnements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux (30j)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : analytics?.recent_subscribers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Derniers 30 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programme Populaire</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscribers">Liste des Abonnés</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          <SubscriberFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
          <SubscriberTable
            subscribers={subscribers}
            loading={loading}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="analytics">
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