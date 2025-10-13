import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Mail, UserPlus, Eye, Bell } from 'lucide-react';

// MOCKUP DATA - Will be replaced with real data from useCourseEngagement hook
const mockCourseMetrics = [
  {
    course_id: '1',
    title: 'Formation Intelligence Artificielle',
    enrollments: 2,
    avg_progress: 0,
    days_since_last_enrollment: 32,
    never_accessed_count: 2,
    engagement_score: 12,
    status: 'at_risk',
    recommendation: 'Envoyer email de rappel aux 2 étudiants inactifs'
  },
  {
    course_id: '2',
    title: 'Formation Cybersécurité Avancée',
    enrollments: 1,
    avg_progress: 0,
    days_since_last_enrollment: 45,
    never_accessed_count: 1,
    engagement_score: -20,
    status: 'dormant',
    recommendation: 'Créer campagne email pour promouvoir ce cours'
  },
  {
    course_id: '3',
    title: 'Développement Web Full Stack',
    enrollments: 0,
    avg_progress: 0,
    days_since_last_enrollment: null,
    never_accessed_count: 0,
    engagement_score: 0,
    status: 'dormant',
    recommendation: 'Aucune inscription - Créer campagne de promotion'
  },
  {
    course_id: '4',
    title: 'Formation Python Avancé',
    enrollments: 3,
    avg_progress: 25,
    days_since_last_enrollment: 5,
    never_accessed_count: 0,
    engagement_score: 85,
    status: 'hot',
    recommendation: 'Cours performant - Continuer à promouvoir'
  }
];

const CourseInsightsPanel: React.FC = () => {
  const hotCourses = mockCourseMetrics.filter(c => c.status === 'hot');
  const atRiskCourses = mockCourseMetrics.filter(c => c.status === 'at_risk');
  const dormantCourses = mockCourseMetrics.filter(c => c.status === 'dormant');
  const stableCourses = mockCourseMetrics.filter(c => c.status === 'stable');

  const totalEnrollments = mockCourseMetrics.reduce((sum, c) => sum + c.enrollments, 0);
  const avgEngagement = mockCourseMetrics.reduce((sum, c) => sum + c.engagement_score, 0) / mockCourseMetrics.length;
  const totalNeverAccessed = mockCourseMetrics.reduce((sum, c) => sum + c.never_accessed_count, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">🔥 Hot</Badge>;
      case 'at_risk':
        return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">⚠️ À risque</Badge>;
      case 'dormant':
        return <Badge className="bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20">💤 Dormant</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">✓ Stable</Badge>;
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 60) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 20) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Inscriptions</CardDescription>
            <CardTitle className="text-3xl">{totalEnrollments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Cours actifs: {mockCourseMetrics.filter(c => c.enrollments > 0).length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Score d'Engagement Moyen</CardDescription>
            <CardTitle className={`text-3xl ${getEngagementColor(avgEngagement)}`}>
              {avgEngagement.toFixed(0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(avgEngagement + 100) / 2} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Étudiants Jamais Accédé
            </CardDescription>
            <CardTitle className="text-3xl text-amber-600 dark:text-amber-400">
              {totalNeverAccessed}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nécessitent une intervention immédiate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hot Courses */}
      {hotCourses.length > 0 && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Cours Performants ({hotCourses.length})
            </CardTitle>
            <CardDescription>
              Cours avec un engagement élevé et une activité récente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotCourses.map((course) => (
              <div key={course.course_id} className="flex items-start justify-between p-4 rounded-lg bg-card border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                    <span>📚 {course.enrollments} inscriptions</span>
                    <span>📊 {course.avg_progress}% progression moy.</span>
                    <span className={getEngagementColor(course.engagement_score)}>
                      ⚡ Score: {course.engagement_score}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    ✓ {course.recommendation}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* At-Risk Courses */}
      {atRiskCourses.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Cours À Risque ({atRiskCourses.length})
            </CardTitle>
            <CardDescription>
              Cours avec des inscriptions mais aucune activité récente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskCourses.map((course) => (
              <div key={course.course_id} className="flex items-start justify-between p-4 rounded-lg bg-card border border-amber-500/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                    <span>📚 {course.enrollments} inscriptions</span>
                    <span>🚫 {course.never_accessed_count} jamais accédé</span>
                    <span>⏱️ {course.days_since_last_enrollment}j depuis dernière inscription</span>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    💡 {course.recommendation}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" className="border-amber-500/20">
                    <Bell className="w-4 h-4 mr-2" />
                    Envoyer Rappel
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Campagne
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dormant Courses */}
      {dormantCourses.length > 0 && (
        <Card className="border-slate-500/20 bg-slate-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-slate-600" />
              Cours Dormants ({dormantCourses.length})
            </CardTitle>
            <CardDescription>
              Cours sans inscriptions ou abandonnés depuis longtemps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dormantCourses.slice(0, 3).map((course) => (
              <div key={course.course_id} className="flex items-start justify-between p-4 rounded-lg bg-card border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                    <span>📚 {course.enrollments} inscriptions</span>
                    <span>📊 {course.avg_progress}% progression</span>
                    {course.days_since_last_enrollment ? (
                      <span>⏱️ {course.days_since_last_enrollment}j inactif</span>
                    ) : (
                      <span className="text-rose-600">🚫 Jamais inscrit</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    💡 {course.recommendation}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Promouvoir
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscrire
                  </Button>
                </div>
              </div>
            ))}
            {dormantCourses.length > 3 && (
              <Button variant="ghost" className="w-full">
                Voir {dormantCourses.length - 3} cours dormants de plus
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseInsightsPanel;
