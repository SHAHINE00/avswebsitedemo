
import React, { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, Award, UserCheck, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  enrollmentsByMonth: { month: string; enrollments: number }[];
  enrollmentsByCourse: { courseName: string; enrollments: number; completionRate: number }[];
  progressDistribution: { range: string; count: number }[];
}

const EnrollmentAnalytics: React.FC = () => {
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollmentStats();
  }, []);

  const fetchEnrollmentStats = async () => {
    try {
      setLoading(true);
      
      // Fetch enrollment data
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses:course_id (
            title
          )
        `);

      if (enrollmentsError) throw enrollmentsError;

      // Process data
      const totalEnrollments = enrollments?.length || 0;
      const activeEnrollments = enrollments?.filter(e => e.status === 'active').length || 0;
      const completedEnrollments = enrollments?.filter(e => e.status === 'completed').length || 0;
      
      const totalProgress = enrollments?.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) || 0;
      const averageProgress = totalEnrollments > 0 ? Math.round(totalProgress / totalEnrollments) : 0;

      // Enrollments by month (last 6 months)
      const monthlyData = getMonthlyEnrollments(enrollments || []);
      
      // Enrollments by course
      const courseData = getCourseEnrollments(enrollments || []);
      
      // Progress distribution
      const progressData = getProgressDistribution(enrollments || []);

      setStats({
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        averageProgress,
        enrollmentsByMonth: monthlyData,
        enrollmentsByCourse: courseData,
        progressDistribution: progressData,
      });

    } catch (error) {
      logError('Error fetching enrollment stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques d'inscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyEnrollments = (enrollments: any[]) => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = monthNames[date.getMonth()];
      
      const count = enrollments.filter(e => {
        const enrollDate = new Date(e.enrolled_at);
        const enrollKey = `${enrollDate.getFullYear()}-${String(enrollDate.getMonth() + 1).padStart(2, '0')}`;
        return enrollKey === monthKey;
      }).length;
      
      last6Months.push({ month: monthName, enrollments: count });
    }
    
    return last6Months;
  };

  const getCourseEnrollments = (enrollments: any[]) => {
    const courseMap = new Map();
    
    enrollments.forEach(enrollment => {
      const courseName = enrollment.courses?.title || 'Cours non trouvé';
      if (!courseMap.has(courseName)) {
        courseMap.set(courseName, { total: 0, completed: 0 });
      }
      
      const data = courseMap.get(courseName);
      data.total += 1;
      if (enrollment.status === 'completed') {
        data.completed += 1;
      }
    });
    
    return Array.from(courseMap.entries()).map(([courseName, data]) => ({
      courseName,
      enrollments: data.total,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  };

  const getProgressDistribution = (enrollments: any[]) => {
    const ranges = [
      { range: '0-20%', min: 0, max: 20 },
      { range: '21-40%', min: 21, max: 40 },
      { range: '41-60%', min: 41, max: 60 },
      { range: '61-80%', min: 61, max: 80 },
      { range: '81-100%', min: 81, max: 100 },
    ];
    
    return ranges.map(({ range, min, max }) => ({
      range,
      count: enrollments.filter(e => {
        const progress = e.progress_percentage || 0;
        return progress >= min && progress <= max;
      }).length,
    }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions Actives</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formations Terminées</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Inscriptions par Mois</CardTitle>
            <CardDescription>Évolution des inscriptions sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.enrollmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution de la Progression</CardTitle>
            <CardDescription>Répartition des étudiants par niveau de progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.progressDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, count }) => `${range}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.progressDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Inscriptions par Cours</CardTitle>
          <CardDescription>Nombre d'inscriptions et taux de réussite par formation</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.enrollmentsByCourse} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="courseName" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="enrollments" fill="#3B82F6" name="Inscriptions" />
              <Bar yAxisId="right" dataKey="completionRate" fill="#10B981" name="Taux de réussite (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentAnalytics;
