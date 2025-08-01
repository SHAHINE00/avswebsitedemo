import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Target, 
  RefreshCw,
  MousePointer,
  Download,
  Mail,
  Calendar,
  BookOpen
} from 'lucide-react';
import { analytics } from '@/utils/analytics';
import { monitoring } from '@/utils/monitoring';

interface RealTimeMetric {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

const RealTimeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock real-time data - in production this would come from your analytics service
  const loadRealTimeData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMetrics: RealTimeMetric[] = [
      {
        label: 'Visiteurs actifs',
        value: 47,
        change: 12,
        icon: <Users className="w-4 h-4" />
      },
      {
        label: 'Pages vues (24h)',
        value: 1234,
        change: -5,
        icon: <Eye className="w-4 h-4" />
      },
      {
        label: 'Inscriptions cours',
        value: 23,
        change: 18,
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        label: 'Rendez-vous pris',
        value: 8,
        change: 33,
        icon: <Calendar className="w-4 h-4" />
      },
      {
        label: 'Newsletter',
        value: 156,
        change: 25,
        icon: <Mail className="w-4 h-4" />
      },
      {
        label: 'Téléchargements',
        value: 89,
        change: -8,
        icon: <Download className="w-4 h-4" />
      }
    ];

    // Get recent events from monitoring system
    const recentErrors = monitoring.getRecentErrors(5);
    const recentPerformance = monitoring.getRecentPerformanceMetrics(5);
    
    const mockEvents = [
      { type: 'enrollment', message: 'Nouvelle inscription au cours IA', time: '2 min' },
      { type: 'contact', message: 'Nouveau message de contact', time: '5 min' },
      { type: 'newsletter', message: '3 nouvelles inscriptions newsletter', time: '8 min' },
      { type: 'appointment', message: 'Rendez-vous pris pour demain', time: '12 min' },
      { type: 'download', message: 'Guide cybersécurité téléchargé', time: '15 min' }
    ];

    setMetrics(mockMetrics);
    setRecentEvents([...recentErrors, ...recentPerformance, ...mockEvents].slice(0, 10));
    setLoading(false);
  };

  useEffect(() => {
    loadRealTimeData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'contact': return <Mail className="w-4 h-4 text-green-500" />;
      case 'newsletter': return <Mail className="w-4 h-4 text-purple-500" />;
      case 'appointment': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'download': return <Download className="w-4 h-4 text-cyan-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics en Temps Réel
            </CardTitle>
            <CardDescription>
              Métriques d'engagement et activité en direct
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadRealTimeData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <span className="text-sm font-medium text-gray-600">
                        {metric.label}
                      </span>
                    </div>
                    <Badge 
                      variant={metric.change >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                    <p className={`text-xs ${getChangeColor(metric.change)}`}>
                      {metric.change >= 0 ? 'Augmentation' : 'Diminution'} vs. hier
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>
                Derniers événements et interactions utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.message}</p>
                        <p className="text-xs text-gray-500">Il y a {event.time || event.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance du Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps de chargement moyen</span>
                    <Badge variant="outline">1.2s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score Core Web Vitals</span>
                    <Badge className="bg-green-500">95/100</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de rebond</span>
                    <Badge variant="outline">23%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps de session moyen</span>
                    <Badge variant="outline">4m 32s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux d'inscription cours</span>
                    <Badge className="bg-blue-500">12.3%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux newsletter</span>
                    <Badge className="bg-purple-500">8.7%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux rendez-vous</span>
                    <Badge className="bg-orange-500">3.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux contact</span>
                    <Badge className="bg-green-500">5.8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeAnalytics;