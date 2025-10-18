import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface AttendanceAnalyticsProps {
  courseId: string;
}

interface AttendanceStats {
  total_students: number;
  avg_attendance_rate: number;
  at_risk_students: number;
  trend: 'up' | 'down' | 'stable';
}

interface ChartData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ courseId }) => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [courseId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch attendance records for the course
      const { data: attendanceData, error } = await supabase
        .from('attendance')
        .select('student_id, attendance_date, status')
        .eq('course_id', courseId)
        .order('attendance_date', { ascending: true });

      if (error) throw error;

      // Calculate stats
      const uniqueStudents = new Set(attendanceData?.map(a => a.student_id) || []).size;
      const totalRecords = attendanceData?.length || 0;
      const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0;
      const avgRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

      // Calculate at-risk students (< 75% attendance)
      const studentAttendance = new Map<string, { present: number; total: number }>();
      attendanceData?.forEach(record => {
        const current = studentAttendance.get(record.student_id) || { present: 0, total: 0 };
        current.total++;
        if (record.status === 'present') current.present++;
        studentAttendance.set(record.student_id, current);
      });

      const atRisk = Array.from(studentAttendance.values()).filter(
        stats => (stats.present / stats.total) < 0.75
      ).length;

      // Group by date for chart
      const dateMap = new Map<string, { present: number; absent: number; late: number }>();
      attendanceData?.forEach(record => {
        const date = record.attendance_date;
        const current = dateMap.get(date) || { present: 0, absent: 0, late: 0 };
        if (record.status === 'present') current.present++;
        else if (record.status === 'absent') current.absent++;
        else if (record.status === 'late') current.late++;
        dateMap.set(date, current);
      });

      const chartDataArray: ChartData[] = Array.from(dateMap.entries())
        .map(([date, counts]) => ({
          date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
          ...counts
        }))
        .slice(-10); // Last 10 sessions

      setChartData(chartDataArray);
      setStats({
        total_students: uniqueStudents,
        avg_attendance_rate: avgRate,
        at_risk_students: atRisk,
        trend: avgRate > 75 ? 'up' : avgRate > 60 ? 'stable' : 'down'
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des statistiques...</div>;
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Étudiants inscrits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
               stats.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> :
               <TrendingUp className="h-4 w-4 text-orange-500" />}
              Taux de présence moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_attendance_rate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Étudiants à risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.at_risk_students}</div>
            <p className="text-xs text-muted-foreground mt-1">{'<'}75% présence</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la présence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" name="Présent" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                  <Line type="monotone" dataKey="late" stroke="#f97316" name="Retard" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par session</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" name="Présent" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  <Bar dataKey="late" fill="#f97316" name="Retard" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
