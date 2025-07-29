
import React, { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BookOpen, Users, TrendingUp, Clock, Eye, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CourseMetrics {
  id: string;
  title: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  completionRate: number;
  viewCount: number;
  conversionRate: number;
  lastViewedAt: string;
  status: string;
}

interface PerformanceData {
  courses: CourseMetrics[];
  totalViews: number;
  totalEnrollments: number;
  overallCompletionRate: number;
  averageTimeToComplete: number;
}

const CoursePerformanceMetrics: React.FC = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses with their enrollments
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments (
            id,
            status,
            progress_percentage,
            enrolled_at,
            completion_date
          )
        `);

      if (coursesError) throw coursesError;

      // Calculate metrics for each course
      const courseMetrics: CourseMetrics[] = courses?.map(course => {
        const enrollments = course.course_enrollments || [];
        const totalEnrollments = enrollments.length;
        const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
        const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
        
        const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0);
        const averageProgress = totalEnrollments > 0 ? Math.round(totalProgress / totalEnrollments) : 0;
        const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
        
        const viewCount = course.view_count || 0;
        const conversionRate = viewCount > 0 ? Math.round((totalEnrollments / viewCount) * 100) : 0;

        return {
          id: course.id,
          title: course.title,
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          averageProgress,
          completionRate,
          viewCount,
          conversionRate,
          lastViewedAt: course.last_viewed_at || course.created_at,
          status: course.status,
        };
      }) || [];

      // Calculate overall metrics
      const totalViews = courseMetrics.reduce((sum, course) => sum + course.viewCount, 0);
      const totalEnrollments = courseMetrics.reduce((sum, course) => sum + course.totalEnrollments, 0);
      const totalCompleted = courseMetrics.reduce((sum, course) => sum + course.completedEnrollments, 0);
      const overallCompletionRate = totalEnrollments > 0 ? Math.round((totalCompleted / totalEnrollments) * 100) : 0;

      setData({
        courses: courseMetrics,
        totalViews,
        totalEnrollments,
        overallCompletionRate,
        averageTimeToComplete: 45, // Placeholder - would need more complex calculation
      });

    } catch (error) {
      logError('Error fetching performance data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les métriques de performance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Publié', variant: 'default' as const },
      draft: { label: 'Brouillon', variant: 'secondary' as const },
      archived: { label: 'Archivé', variant: 'outline' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config?.variant || 'secondary'}>
        {config?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vues</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.totalEnrollments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.overallCompletionRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.averageTimeToComplete}j</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par Cours</CardTitle>
          <CardDescription>Comparaison des inscriptions et taux de conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.courses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="title" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="totalEnrollments" fill="#3B82F6" name="Inscriptions" />
              <Bar yAxisId="right" dataKey="conversionRate" fill="#10B981" name="Taux de conversion (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Course Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Détaillées par Cours</CardTitle>
          <CardDescription>Vue d'ensemble des performances de chaque formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(course.status)}
                      <span className="text-sm text-muted-foreground">
                        Dernière vue: {new Date(course.lastViewedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{course.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Taux de réussite</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      Vues
                    </div>
                    <div className="font-semibold">{course.viewCount.toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      Inscriptions
                    </div>
                    <div className="font-semibold">{course.totalEnrollments}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="w-3 h-3" />
                      Actives
                    </div>
                    <div className="font-semibold text-green-600">{course.activeEnrollments}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3 h-3" />
                      Terminées
                    </div>
                    <div className="font-semibold text-blue-600">{course.completedEnrollments}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      Conversion
                    </div>
                    <div className="font-semibold text-orange-600">{course.conversionRate}%</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression moyenne</span>
                    <span>{course.averageProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.averageProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursePerformanceMetrics;
