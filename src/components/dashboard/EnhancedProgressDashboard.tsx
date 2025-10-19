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
  Timer,
  Sparkles,
  Brain,
  Zap,
  Users
} from 'lucide-react';
import SmartStudyRecommendations from './SmartStudyRecommendations';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';
import { useGamification } from '@/hooks/useGamification';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

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
  weeklyProgress: number[];
}

interface EnhancedProgressDashboardProps {
  enrollments: Enrollment[];
  studyStats: StudyStats;
}

const EnhancedProgressDashboard = ({ 
  enrollments, 
  studyStats 
}: EnhancedProgressDashboardProps) => {
  const { studyStats: analyticsStats, loading: studyLoading } = useStudyAnalytics();
  const { userLevel, userRank } = useGamification();
  
  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  
  const overallProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length 
    : 0;

  const weeklyProgressPercentage = (studyStats.totalHours / studyStats.weeklyGoal) * 100;

  // Calculate insights from study data
  const calculateInsights = () => {
    const insights = [];
    
    if (analyticsStats.currentStreak >= 7) {
      insights.push({
        type: 'success',
        title: 'Excellente régularité !',
        description: `Vous avez une série de ${analyticsStats.currentStreak} jours d'étude.`,
        icon: <Zap className="w-4 h-4" />
      });
    }
    
    if (analyticsStats.completionRate >= 80) {
      insights.push({
        type: 'success',
        title: 'Taux de réussite élevé',
        description: `Vous terminez ${analyticsStats.completionRate}% de vos leçons.`,
        icon: <Target className="w-4 h-4" />
      });
    }
    
    if (analyticsStats.averageSessionTime < 15) {
      insights.push({
        type: 'info',
        title: 'Sessions courtes détectées',
        description: 'Essayez des sessions plus longues pour une meilleure rétention.',
        icon: <Timer className="w-4 h-4" />
      });
    }
    
    return insights;
  };

  const insights = studyLoading ? [] : calculateInsights();

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
        <TabsList className="flex flex-wrap w-full gap-2 h-auto">
          <TabsTrigger value="courses">Formations</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
          <TabsTrigger value="insights">
            <Brain className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Sparkles className="h-4 w-4 mr-2" />
            Recommandations IA
          </TabsTrigger>
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

        <TabsContent value="insights" className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temps total</p>
                    <p className="text-2xl font-bold">{analyticsStats.totalHours}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Série actuelle</p>
                    <p className="text-2xl font-bold">{analyticsStats.currentStreak} jours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Niveau</p>
                    <p className="text-2xl font-bold">{userLevel.level}</p>
                    <p className="text-xs text-muted-foreground">{userLevel.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Classement</p>
                    <p className="text-2xl font-bold">#{userRank || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Progression hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsStats.weeklyProgress.map((hours, index) => ({
                    day: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][index],
                    hours
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Répartition par matière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analyticsStats.subjectBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                      label={({ subject, percentage }) => `${subject} (${percentage}%)`}
                    >
                      {analyticsStats.subjectBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Progress Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Évolution mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsStats.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Insights personnalisés</h3>
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        insight.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {insight.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun insight disponible</h3>
                  <p className="text-muted-foreground">
                    Continuez à étudier pour obtenir des insights personnalisés.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <SmartStudyRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProgressDashboard;
