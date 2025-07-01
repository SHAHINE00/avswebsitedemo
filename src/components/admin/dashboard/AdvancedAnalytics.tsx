
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, TrendingUp, Download, Filter } from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

const AdvancedAnalytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [metricType, setMetricType] = useState<string | null>(null);
  
  const startDate = format(subDays(new Date(), parseInt(dateRange)), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');
  
  const { data, loading, error } = useAdvancedAnalytics(
    startDate,
    endDate,
    metricType ? [metricType] : null
  );

  const processDataForCharts = () => {
    if (!data.length) return { lineData: [], barData: [], pieData: [] };

    // Group data by date for line chart
    const dateGroups = data.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) acc[date] = {};
      acc[date][item.metric_name] = item.value;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const lineData = Object.entries(dateGroups).map(([date, metrics]) => ({
      date: format(new Date(date), 'dd/MM', { locale: fr }),
      ...metrics
    }));

    // Group data by metric type for bar chart
    const metricGroups = data.reduce((acc, item) => {
      if (!acc[item.metric_type]) acc[item.metric_type] = 0;
      acc[item.metric_type] += item.value;
      return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(metricGroups).map(([type, value]) => ({
      type,
      value
    }));

    // Create pie data from recent metrics
    const pieData = Object.entries(metricGroups).map(([type, value], index) => ({
      name: type,
      value,
      color: COLORS[index % COLORS.length]
    }));

    return { lineData, barData, pieData };
  };

  const { lineData, barData, pieData } = processDataForCharts();

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Metric', 'Value'],
      ...data.map(item => [item.date, item.metric_type, item.metric_name, item.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${startDate}-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement des analyses avancées...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analyses Avancées
          </CardTitle>
          <CardDescription>
            Visualisations interactives et analyses détaillées des données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 derniers jours</SelectItem>
                <SelectItem value="30">30 derniers jours</SelectItem>
                <SelectItem value="90">90 derniers jours</SelectItem>
                <SelectItem value="365">1 an</SelectItem>
              </SelectContent>
            </Select>

            <Select value={metricType || 'all'} onValueChange={(value) => setMetricType(value === 'all' ? null : value)}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="user_activity">Activité utilisateur</SelectItem>
                <SelectItem value="course_engagement">Engagement cours</SelectItem>
                <SelectItem value="system_performance">Performance système</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Temporelle</CardTitle>
              <CardDescription>Tendances des métriques au fil du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(lineData[0] || {}).filter(key => key !== 'date').map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison par Type</CardTitle>
              <CardDescription>Volumes par catégorie de métriques</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Métriques</CardTitle>
              <CardDescription>Distribution proportionnelle des données</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
