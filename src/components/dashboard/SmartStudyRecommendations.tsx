import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Target, Clock, TrendingUp, BookOpen, Zap, Calendar, ArrowRight } from 'lucide-react';

interface StudyRecommendation {
  id: string;
  type: 'schedule' | 'content' | 'performance' | 'streak' | 'review';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionText: string;
  actionUrl?: string;
  metadata?: any;
}

interface OptimalStudyTime {
  hour: number;
  score: number;
  label: string;
}

const SmartStudyRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { studyStats } = useStudyAnalytics();
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalStudyTime[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate AI-powered study recommendations
  const generateRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const newRecommendations: StudyRecommendation[] = [];

      // 1. Weekly Goal Progress Recommendation
      if (studyStats.weeklyProgress.length > 0) {
        const currentWeekHours = studyStats.weeklyProgress.reduce((sum, hours) => sum + hours, 0);
        const progressPercentage = (currentWeekHours / studyStats.weeklyGoal) * 100;
        
        if (progressPercentage < 50) {
          newRecommendations.push({
            id: 'weekly_goal_behind',
            type: 'schedule',
            title: 'Objectif hebdomadaire en retard',
            description: `Vous n'avez atteint que ${progressPercentage.toFixed(0)}% de votre objectif. Planifiez 2-3 sessions courtes cette semaine.`,
            priority: 'high',
            actionText: 'Planifier maintenant',
            metadata: { remainingHours: studyStats.weeklyGoal - currentWeekHours }
          });
        } else if (progressPercentage > 100) {
          newRecommendations.push({
            id: 'weekly_goal_exceeded',
            type: 'performance',
            title: 'Objectif dépassé ! 🎉',
            description: `Excellent ! Vous avez dépassé votre objectif de ${(progressPercentage - 100).toFixed(0)}%. Maintenez ce rythme.`,
            priority: 'low',
            actionText: 'Voir les progrès',
            metadata: { overagePercentage: progressPercentage - 100 }
          });
        }
      }

      // 2. Study Streak Recommendations
      if (studyStats.currentStreak === 0) {
        newRecommendations.push({
          id: 'restart_streak',
          type: 'streak',
          title: 'Relancez votre série d\'étude',
          description: 'Commencez une nouvelle série en étudiant aujourd\'hui, même 15 minutes suffisent.',
          priority: 'medium',
          actionText: 'Commencer maintenant',
          metadata: { minimumTime: 15 }
        });
      } else if (studyStats.currentStreak >= 7) {
        newRecommendations.push({
          id: 'maintain_streak',
          type: 'streak',
          title: `Série de ${studyStats.currentStreak} jours ! 🔥`,
          description: 'Incroyable régularité ! Continuez sur cette lancée pour maximiser votre apprentissage.',
          priority: 'low',
          actionText: 'Continuer',
          metadata: { currentStreak: studyStats.currentStreak }
        });
      }

      // 3. Content-based Recommendations
      if (studyStats.subjectBreakdown.length > 0) {
        const leastStudiedSubject = studyStats.subjectBreakdown
          .sort((a, b) => a.hours - b.hours)[0];
        
        if (leastStudiedSubject && leastStudiedSubject.hours < 2) {
          newRecommendations.push({
            id: 'balance_subjects',
            type: 'content',
            title: 'Équilibrez vos matières',
            description: `${leastStudiedSubject.subject} nécessite plus d'attention. Consacrez-y votre prochaine session.`,
            priority: 'medium',
            actionText: 'Étudier maintenant',
            metadata: { subject: leastStudiedSubject.subject }
          });
        }
      }

      // 4. Performance-based Recommendations
      if (studyStats.averageSessionTime < 20) {
        newRecommendations.push({
          id: 'extend_sessions',
          type: 'performance',
          title: 'Sessions trop courtes',
          description: `Vos sessions durent en moyenne ${studyStats.averageSessionTime} min. Essayez 25-45 min pour une meilleure rétention.`,
          priority: 'medium',
          actionText: 'Optimiser',
          metadata: { currentAverage: studyStats.averageSessionTime, recommended: 30 }
        });
      }

      // 5. Review Recommendations based on completion patterns
      const { data: recentLessons } = await supabase
        .from('lesson_progress')
        .select(`
          lesson_id,
          completion_date,
          course_lessons (title)
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completion_date', { ascending: false })
        .limit(10);

      if (recentLessons && recentLessons.length > 0) {
        const oldestLesson = recentLessons[recentLessons.length - 1];
        const daysSinceCompletion = Math.floor(
          (Date.now() - new Date(oldestLesson.completion_date).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceCompletion >= 7) {
          newRecommendations.push({
            id: 'review_old_content',
            type: 'review',
            title: 'Révision recommandée',
            description: `Il y a ${daysSinceCompletion} jours que vous avez terminé "${oldestLesson.course_lessons?.title}". Une révision consoliderait vos acquis.`,
            priority: 'low',
            actionText: 'Réviser',
            metadata: { lessonId: oldestLesson.lesson_id, daysSince: daysSinceCompletion }
          });
        }
      }

      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate optimal study times based on user behavior
  const calculateOptimalStudyTimes = async () => {
    if (!user) return;

    try {
      // Get study sessions with timestamps
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('started_at, duration_minutes')
        .eq('user_id', user.id)
        .gte('duration_minutes', 10) // Only sessions longer than 10 minutes
        .order('started_at', { ascending: false })
        .limit(100);

      if (!sessions || sessions.length < 5) {
        // Default optimal times if not enough data
        setOptimalTimes([
          { hour: 9, score: 85, label: '9h00 - Matin productif' },
          { hour: 14, score: 75, label: '14h00 - Après-midi' },
          { hour: 20, score: 70, label: '20h00 - Soirée' }
        ]);
        return;
      }

      // Analyze sessions by hour
      const hourlyStats: { [hour: number]: { count: number; totalDuration: number } } = {};
      
      sessions.forEach(session => {
        const hour = new Date(session.started_at).getHours();
        if (!hourlyStats[hour]) {
          hourlyStats[hour] = { count: 0, totalDuration: 0 };
        }
        hourlyStats[hour].count++;
        hourlyStats[hour].totalDuration += session.duration_minutes;
      });

      // Calculate scores based on frequency and average duration
      const timeScores = Object.entries(hourlyStats)
        .map(([hour, stats]) => {
          const avgDuration = stats.totalDuration / stats.count;
          const frequency = stats.count;
          // Score combines frequency and session quality (duration)
          const score = Math.min(100, (frequency * 10) + (avgDuration / 2));
          
          return {
            hour: parseInt(hour),
            score: Math.round(score),
            label: `${hour}h00 - ${getTimeLabel(parseInt(hour))}`
          };
        })
        .filter(time => time.score > 30) // Only show meaningful times
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Top 3 times

      setOptimalTimes(timeScores);
    } catch (error) {
      console.error('Error calculating optimal times:', error);
    }
  };

  const getTimeLabel = (hour: number): string => {
    if (hour >= 6 && hour < 12) return 'Matin';
    if (hour >= 12 && hour < 18) return 'Après-midi';
    if (hour >= 18 && hour < 22) return 'Soirée';
    return 'Nuit';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <Calendar className="w-4 h-4" />;
      case 'content': return <BookOpen className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'streak': return <Zap className="w-4 h-4" />;
      case 'review': return <Brain className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    if (user && studyStats) {
      generateRecommendations();
      calculateOptimalStudyTimes();
    }
  }, [user, studyStats]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Recommandations d'étude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Recommandations personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getPriorityIcon(rec.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' ? 'Urgent' : 
                     rec.priority === 'medium' ? 'Important' : 'Conseil'}
                  </Badge>
                </div>
                <Button size="sm" className="w-full">
                  {rec.actionText}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune recommandation</h3>
              <p className="text-muted-foreground">
                Continuez à étudier pour obtenir des recommandations personnalisées.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimal Study Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Vos créneaux optimaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimalTimes.map((time, index) => (
              <div key={time.hour} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{time.label}</p>
                  <p className="text-sm text-muted-foreground">
                    Score d'efficacité: {time.score}%
                  </p>
                </div>
                <div className="text-right">
                  <Progress value={time.score} className="w-20 h-2" />
                  <Badge variant={index === 0 ? 'default' : 'secondary'} className="mt-1">
                    {index === 0 ? 'Optimal' : 'Recommandé'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartStudyRecommendations;