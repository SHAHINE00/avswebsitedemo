import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Target } from 'lucide-react';

interface SubscriberAnalytics {
  total_subscribers: number;
  recent_subscribers: number;
  popular_programs: Array<{program: string, count: number}>;
  formation_type_split: {complete: number, certificate: number};
  domain_distribution: {ai: number, programming: number, marketing: number};
  monthly_growth: Array<{month: string, count: number}>;
}

interface SubscriberAnalyticsProps {
  analytics: SubscriberAnalytics | null;
  loading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SubscriberAnalytics: React.FC<SubscriberAnalyticsProps> = ({
  analytics,
  loading
}) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for charts
  const formationTypeData = [
    { name: 'Formation Complète', value: analytics.formation_type_split.complete },
    { name: 'Certificat', value: analytics.formation_type_split.certificate }
  ];

  const domainData = [
    { name: 'Intelligence Artificielle', value: analytics.domain_distribution.ai },
    { name: 'Programmation', value: analytics.domain_distribution.programming },
    { name: 'Marketing Digital', value: analytics.domain_distribution.marketing }
  ];

  const topPrograms = analytics.popular_programs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_subscribers}</div>
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
            <div className="text-2xl font-bold">{analytics.recent_subscribers}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round((analytics.recent_subscribers / analytics.total_subscribers) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmes Actifs</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.popular_programs.length}</div>
            <p className="text-xs text-muted-foreground">
              Programmes avec abonnements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.formation_type_split.complete > 0 
                ? Math.round((analytics.formation_type_split.complete / analytics.total_subscribers) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Formations complètes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Abonnements</CardTitle>
            <CardDescription>Nombre d'abonnements par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthly_growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Programs */}
        <Card>
          <CardHeader>
            <CardTitle>Programmes Populaires</CardTitle>
            <CardDescription>Top 5 des programmes les plus choisis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPrograms} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="program" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Formation Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type</CardTitle>
            <CardDescription>Formation complète vs Certificat</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Domain Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Domaine</CardTitle>
            <CardDescription>Préférences de domaine de formation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriberAnalytics;