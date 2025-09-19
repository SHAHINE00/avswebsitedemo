import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, CheckCircle, Clock, Flame, Award, Target } from 'lucide-react';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  courses: {
    title: string;
    subtitle: string;
    duration: string;
  };
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  subject: string;
}

interface DashboardStatsProps {
  enrollments: Enrollment[];
  appointments: Appointment[];
}

const DashboardStats = ({ enrollments, appointments }: DashboardStatsProps) => {
  const { studyStats, loading } = useStudyAnalytics();
  
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
  const upcomingAppointments = appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length;
  
  // Calculate weekly goal progress percentage
  const weeklyProgress = studyStats?.weeklyGoal && typeof studyStats.weeklyProgress === 'number'
    ? Math.min(100, Math.round((studyStats.weeklyProgress / studyStats.weeklyGoal) * 100))
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Formations inscrites
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrollments.length}</div>
          <p className="text-xs text-muted-foreground">
            Cours disponibles
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rendez-vous programmés
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments}</div>
          <p className="text-xs text-muted-foreground">
            À venir
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Formations complétées
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedEnrollments}</div>
          <p className="text-xs text-muted-foreground">
            Terminées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Heures d'étude
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(studyStats?.totalHours || 0)}h</div>
          <p className="text-xs text-muted-foreground">
            Au total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Série d'étude
          </CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studyStats?.currentStreak || 0}</div>
          <p className="text-xs text-muted-foreground">
            {studyStats?.currentStreak === 1 ? 'jour consécutif' : 'jours consécutifs'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Objectif hebdo
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyProgress}%</div>
          <div className="mt-2">
            <Progress value={weeklyProgress} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {studyStats?.weeklyProgress || 0}h / {studyStats?.weeklyGoal || 0}h cette semaine
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;