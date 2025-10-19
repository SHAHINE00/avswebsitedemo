import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, CheckCircle, Clock, Flame, Award, Target } from 'lucide-react';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';
import { useRealTimeData } from '@/hooks/useRealTimeData';

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
  const [statsKey, setStatsKey] = useState(0);
  
  // Configuration for which stats to show
  const SHOW_STATS = {
    enrollments: true,
    appointments: true,
    completed: true,
    studyHours: true,
    streak: false,       // hide from overview
    weeklyGoal: false    // hide from overview
  };
  
  // Use defensive loading for analytics hook
  let studyStats, loading, refreshStats;
  
  try {
    const analytics = useStudyAnalytics();
    studyStats = analytics.studyStats;
    loading = analytics.loading;
    refreshStats = analytics.refreshStats;
  } catch (error) {
    console.warn('useStudyAnalytics failed, using defaults:', error);
    studyStats = {
      totalHours: 0,
      weeklyGoal: 10,
      currentStreak: 0,
      completionRate: 0,
      averageSessionTime: 0,
      lessonsCompleted: 0,
      totalLessons: 0,
      weeklyProgress: 0,
      monthlyProgress: [],
      subjectBreakdown: []
    };
    loading = false;
    refreshStats = () => {};
  }
  
  // Initialize real-time data subscriptions with error handling
  try {
    useRealTimeData();
  } catch (error) {
    console.warn('useRealTimeData failed:', error);
  }
  
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
  const upcomingAppointments = appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed').length;
  
  // Calculate weekly goal progress percentage
  const weeklyProgress = studyStats?.weeklyGoal && typeof studyStats.weeklyProgress === 'number'
    ? Math.min(100, Math.round((studyStats.weeklyProgress / studyStats.weeklyGoal) * 100))
    : 0;

  // Set up real-time listeners for stats updates
  useEffect(() => {
    const handleDataUpdate = () => {
      setStatsKey(prev => prev + 1);
      refreshStats();
    };

    // Listen for real-time data updates
    window.addEventListener('studySessionUpdate', handleDataUpdate);
    window.addEventListener('enrollmentUpdate', handleDataUpdate);
    window.addEventListener('achievementUpdate', handleDataUpdate);
    window.addEventListener('certificateUpdate', handleDataUpdate);

    return () => {
      window.removeEventListener('studySessionUpdate', handleDataUpdate);
      window.removeEventListener('enrollmentUpdate', handleDataUpdate);
      window.removeEventListener('achievementUpdate', handleDataUpdate);
      window.removeEventListener('certificateUpdate', handleDataUpdate);
    };
  }, [refreshStats]);

  // Compute grid columns based on enabled stats
  const enabledCount = Object.values(SHOW_STATS).filter(Boolean).length;
  const gridCols =
    enabledCount >= 6 ? "xl:grid-cols-6" :
    enabledCount === 5 ? "xl:grid-cols-5" :
    enabledCount === 4 ? "xl:grid-cols-4" :
    enabledCount === 3 ? "xl:grid-cols-3" :
    enabledCount === 2 ? "xl:grid-cols-2" : "xl:grid-cols-1";

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-4`}>
        {Array.from({ length: enabledCount }).map((_, i) => (
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
    <div key={statsKey} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-4`}>
      {SHOW_STATS.enrollments && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Formations inscrites
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{enrollments.length}</div>
          <p className="text-xs text-muted-foreground">
            Cours disponibles
          </p>
        </CardContent>
      </Card>
      )}
      
      {SHOW_STATS.appointments && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rendez-vous programmés
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{upcomingAppointments}</div>
          <p className="text-xs text-muted-foreground">
            À venir
          </p>
        </CardContent>
      </Card>
      )}
      
      {SHOW_STATS.completed && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Formations complétées
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{completedEnrollments}</div>
          <p className="text-xs text-muted-foreground">
            Terminées
          </p>
        </CardContent>
      </Card>
      )}

      {SHOW_STATS.studyHours && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Heures d'étude
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{Math.round(studyStats?.totalHours || 0)}h</div>
          <p className="text-xs text-muted-foreground">
            Au total
          </p>
          {studyStats?.weeklyProgress && (
            <p className="text-xs text-green-600">+{studyStats.weeklyProgress}h cette semaine</p>
          )}
        </CardContent>
      </Card>
      )}

      {SHOW_STATS.streak && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Série d'étude
          </CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{studyStats?.currentStreak || 0}</div>
          <p className="text-xs text-muted-foreground">
            {studyStats?.currentStreak === 1 ? 'jour consécutif' : 'jours consécutifs'}
          </p>
          {studyStats?.currentStreak && studyStats.currentStreak > 7 && (
            <p className="text-xs text-orange-600">🔥 Super série!</p>
          )}
        </CardContent>
      </Card>
      )}

      {SHOW_STATS.weeklyGoal && (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Objectif hebdo
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-all duration-300">{weeklyProgress}%</div>
          <div className="mt-2">
            <Progress value={weeklyProgress} className="h-2 transition-all duration-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {studyStats?.weeklyProgress || 0}h / {studyStats?.weeklyGoal || 0}h cette semaine
          </p>
          {weeklyProgress >= 100 && (
            <p className="text-xs text-emerald-600 mt-1">🎯 Objectif atteint!</p>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default DashboardStats;