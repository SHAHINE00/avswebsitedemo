import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdvancedCourseAnalyticsProps {
  courseId: string;
}

interface RiskStudent {
  student_id: string;
  student_name: string;
  risk_level: string;
  risk_score: number;
  attendance_rate: number;
  average_grade: number;
  missing_assignments: number;
  last_activity_days: number;
  recommendations: {
    attendance_concern: boolean;
    grade_concern: boolean;
    engagement_concern: boolean;
    suggested_actions: string[];
  };
}

interface CorrelationData {
  correlation_coefficient: number;
  total_students: number;
  avg_attendance_high_grades: number;
  avg_attendance_low_grades: number;
  data_points: Array<{ attendance_rate: number; grade: number }>;
}

interface TrendData {
  week_start: string;
  avg_grade: number;
  avg_attendance_rate: number;
  total_assignments: number;
  total_sessions: number;
}

const AdvancedCourseAnalytics: React.FC<AdvancedCourseAnalyticsProps> = ({ courseId }) => {
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [correlation, setCorrelation] = useState<CorrelationData | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchAnalytics();
    }
  }, [courseId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [riskData, corrData, trendData] = await Promise.all([
        supabase.rpc('analyze_student_risk', { p_course_id: courseId }),
        supabase.rpc('get_attendance_grade_correlation', { p_course_id: courseId }),
        supabase.rpc('get_performance_trends', { p_course_id: courseId, p_weeks_back: 12 })
      ]);

      if (riskData.data) setRiskStudents(riskData.data as RiskStudent[]);
      if (corrData.data?.[0]) setCorrelation(corrData.data[0] as CorrelationData);
      if (trendData.data) setTrends(trendData.data as TrendData[]);
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des analyses...</div>;
  }

  return (
    <Tabs defaultValue="risk" className="space-y-4">
      <TabsList>
        <TabsTrigger value="risk">Étudiants à risque</TabsTrigger>
        <TabsTrigger value="correlation">Corrélation</TabsTrigger>
        <TabsTrigger value="trends">Tendances</TabsTrigger>
      </TabsList>

      <TabsContent value="risk" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analyse prédictive des risques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Risque élevé</p>
                    <p className="text-3xl font-bold text-destructive">
                      {riskStudents.filter(s => s.risk_level === 'high').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Risque moyen</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {riskStudents.filter(s => s.risk_level === 'medium').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Faible risque</p>
                    <p className="text-3xl font-bold text-green-600">
                      {riskStudents.filter(s => s.risk_level === 'low').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {riskStudents.filter(s => s.risk_level !== 'low').map((student) => (
                <Card key={student.student_id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(student.risk_level)}
                        <div>
                          <h4 className="font-medium">{student.student_name}</h4>
                          <Badge variant={getRiskColor(student.risk_level)} className="mt-1">
                            Score de risque: {student.risk_score.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Présence</p>
                        <p className="font-medium">{student.attendance_rate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Moyenne</p>
                        <p className="font-medium">{student.average_grade.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Devoirs manquants</p>
                        <p className="font-medium">{student.missing_assignments}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dernière activité</p>
                        <p className="font-medium">{student.last_activity_days}j</p>
                      </div>
                    </div>

                    {student.recommendations.suggested_actions.length > 0 && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Actions suggérées:</p>
                        <ul className="text-sm space-y-1">
                          {student.recommendations.suggested_actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {riskStudents.filter(s => s.risk_level !== 'low').length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun étudiant à risque détecté
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="correlation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Corrélation Présence-Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {correlation && (
              <>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Coefficient de corrélation</p>
                        <p className="text-3xl font-bold">
                          {correlation.correlation_coefficient.toFixed(3)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {correlation.correlation_coefficient > 0.5 ? 'Corrélation forte' : 
                           correlation.correlation_coefficient > 0.3 ? 'Corrélation modérée' : 'Corrélation faible'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Présence moyenne (notes ≥70%)</p>
                        <p className="text-3xl font-bold text-green-600">
                          {correlation.avg_attendance_high_grades?.toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Présence moyenne (notes &lt;70%)</p>
                        <p className="text-3xl font-bold text-destructive">
                          {correlation.avg_attendance_low_grades?.toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="attendance_rate" 
                      name="Taux de présence" 
                      unit="%"
                      domain={[0, 100]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="grade" 
                      name="Note moyenne" 
                      unit="%"
                      domain={[0, 100]}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter 
                      name="Étudiants" 
                      data={correlation.data_points} 
                      fill="hsl(var(--primary))"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tendances de performance (12 dernières semaines)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week_start" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avg_grade" 
                  stroke="hsl(var(--primary))" 
                  name="Note moyenne (%)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avg_attendance_rate" 
                  stroke="hsl(var(--chart-2))" 
                  name="Taux de présence (%)"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="total_sessions" 
                  stroke="hsl(var(--muted-foreground))" 
                  name="Sessions"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedCourseAnalytics;
