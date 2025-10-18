import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsProps {
  courseId: string;
}

const ProfessorAnalytics: React.FC<AnalyticsProps> = ({ courseId }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [courseId]);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_grade_statistics', {
        p_course_id: courseId
      });

      if (error) throw error;
      setStats(data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  if (!stats) {
    return <div>Aucune donnée disponible</div>;
  }

  // Prepare distribution data
  const distributionData = stats.distribution ? Object.entries(stats.distribution).map(([key, value]: [string, any]) => ({
    name: key,
    students: value
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de notes</CardDescription>
            <CardTitle className="text-3xl">{stats.total_grades || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Moyenne générale</CardDescription>
            <CardTitle className="text-3xl">{stats.average_grade || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Note la plus haute</CardDescription>
            <CardTitle className="text-3xl">{stats.highest_grade || 0}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Note la plus basse</CardDescription>
            <CardTitle className="text-3xl">{stats.lowest_grade || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des notes</CardTitle>
          <CardDescription>Répartition des étudiants par tranche de notes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="students"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* By Assignment Statistics */}
      {stats.by_assignment && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques par devoir</CardTitle>
            <CardDescription>Moyennes pour chaque devoir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(stats.by_assignment).map(([name, data]: [string, any]) => ({
                name,
                moyenne: data.average,
                max: data.max,
                min: data.min
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="moyenne" fill="#8884d8" />
                <Bar dataKey="max" fill="#82ca9d" />
                <Bar dataKey="min" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessorAnalytics;
