import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  BarChart3,
  Timer
} from 'lucide-react';

interface Enrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  status: string;
  progress_percentage: number;
  last_accessed_at?: string;
  courses: {
    title: string;
    subtitle: string;
    duration: string;
  };
}

interface StudyStats {
  totalHours: number;
  weeklyGoal: number;
  currentStreak: number;
  completionRate: number;
  averageSessionTime: number;
  lessonsCompleted: number;
  totalLessons: number;
}

interface EnhancedProgressDashboardProps {
  enrollments: Enrollment[];
  studyStats: StudyStats;
}

const EnhancedProgressDashboard = ({ 
  enrollments, 
  studyStats 
}: EnhancedProgressDashboardProps) => {
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  
  const overallProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length 
    : 0;

  const weeklyProgressPercentage = (studyStats.totalHours / studyStats.weeklyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures d'Étude</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              Objectif: {studyStats.weeklyGoal}h/semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">jours consécutifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {studyStats.lessonsCompleted}/{studyStats.totalLessons} leçons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Formations</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {activeEnrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{enrollment.courses.title}</CardTitle>
                      <CardDescription>{enrollment.courses.subtitle}</CardDescription>
                    </div>
                    <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                      {enrollment.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{enrollment.progress_percentage}%</span>
                    </div>
                    <Progress value={enrollment.progress_percentage} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Durée: {enrollment.courses.duration}</span>
                      <span>
                        Dernière activité: {
                          enrollment.last_accessed_at 
                            ? new Date(enrollment.last_accessed_at).toLocaleDateString()
                            : 'Jamais'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Objectif Hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progrès cette semaine</span>
                    <span>{studyStats.totalHours}h / {studyStats.weeklyGoal}h</span>
                  </div>
                  <Progress value={Math.min(weeklyProgressPercentage, 100)} />
                  <p className="text-xs text-muted-foreground">
                    {weeklyProgressPercentage >= 100 
                      ? '🎉 Objectif atteint!' 
                      : `${Math.round(studyStats.weeklyGoal - studyStats.totalHours)}h restantes`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Temps de Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyStats.averageSessionTime}min</div>
                <p className="text-xs text-muted-foreground">
                  Durée moyenne par session d'étude
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs d'Apprentissage</CardTitle>
              <CardDescription>
                Suivez vos objectifs et votre progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Terminer 2 formations ce mois</p>
                      <p className="text-sm text-muted-foreground">
                        {completedEnrollments.length}/2 formations terminées
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={(completedEnrollments.length / 2) * 100} 
                    className="w-20"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Étudier {studyStats.weeklyGoal}h par semaine</p>
                      <p className="text-sm text-muted-foreground">
                        {studyStats.totalHours}/{studyStats.weeklyGoal}h cette semaine
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={weeklyProgressPercentage} 
                    className="w-20"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Maintenir une série de 7 jours</p>
                      <p className="text-sm text-muted-foreground">
                        {studyStats.currentStreak}/7 jours
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={(studyStats.currentStreak / 7) * 100} 
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProgressDashboard;