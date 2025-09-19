import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStudyAnalytics } from '@/hooks/useStudyAnalytics';
import { useGamification } from '@/hooks/useGamification';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, Brain, Clock, Calendar, BookOpen, Trophy, Zap, Users } from 'lucide-react';

interface AdvancedAnalyticsProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d';
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ 
  timeRange = '30d' 
}) => {
  const { studyStats, loading: studyLoading } = useStudyAnalytics();
  const { userLevel, userPoints, userRank, leaderboard } = useGamification();
  const { data: analyticsData, loading: analyticsLoading } = useAdvancedAnalytics();
  
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate insights from study data
  const calculateInsights = () => {
    const insights = [];
    
    if (studyStats.currentStreak >= 7) {
      insights.push({
        type: 'success',
        title: 'Excellente régularité !',
        description: `Vous avez une série de ${studyStats.currentStreak} jours d'étude.`,
        icon: <Zap className="w-4 h-4" />
      });
    }
    
    if (studyStats.completionRate >= 80) {
      insights.push({
        type: 'success',
        title: 'Taux de réussite élevé',
        description: `Vous terminez ${studyStats.completionRate}% de vos leçons.`,
        icon: <Target className="w-4 h-4" />
      });
    }
    
    if (studyStats.averageSessionTime < 15) {
      insights.push({
        type: 'info',
        title: 'Sessions courtes détectées',
        description: 'Essayez des sessions plus longues pour une meilleure rétention.',
        icon: <Clock className="w-4 h-4" />
      });
    }
    
    return insights;
  };

  const insights = calculateInsights();

  // Generate study recommendations
  const getStudyRecommendations = () => {
    const recommendations = [];
    
    // Based on current progress
    if (studyStats.weeklyProgress.length > 0) {
      const thisWeekHours = studyStats.weeklyProgress.reduce((sum, hours) => sum + hours, 0);
      const remainingGoal = Math.max(0, studyStats.weeklyGoal - thisWeekHours);
      
      if (remainingGoal > 0) {
        recommendations.push({
          title: 'Objectif hebdomadaire',
          description: `Il vous reste ${remainingGoal.toFixed(1)}h pour atteindre votre objectif.`,
          action: 'Planifier une session',
          priority: 'medium'
        });
      }
    }
    
    // Based on subject performance
    if (studyStats.subjectBreakdown.length > 0) {
      const leastStudiedSubject = studyStats.subjectBreakdown
        .sort((a, b) => a.hours - b.hours)[0];
      
      if (leastStudiedSubject && leastStudiedSubject.hours < 2) {
        recommendations.push({
          title: 'Matière à renforcer',
          description: `Vous avez peu étudié ${leastStudiedSubject.subject} récemment.`,
          action: 'Reprendre cette matière',
          priority: 'high'
        });
      }
    }
    
    return recommendations;
  };

  const recommendations = getStudyRecommendations();

  if (studyLoading || analyticsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics avancées</CardTitle>
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
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Temps total</p>
                <p className="text-2xl font-bold">{studyStats.totalHours}h</p>
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
                <p className="text-2xl font-bold">{studyStats.currentStreak} jours</p>
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

      {/* Advanced Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="progress">Progression</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
                      <BarChart data={studyStats.weeklyProgress.map((hours, index) => ({
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
                          data={studyStats.subjectBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="hours"
                          label={({ subject, percentage }) => `${subject} (${percentage}%)`}
                        >
                          {studyStats.subjectBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Monthly Progress Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Évolution mensuelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={studyStats.monthlyProgress}>
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

              {/* Weekly Goal Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Objectif hebdomadaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>
                        {studyStats.weeklyProgress.reduce((sum, hours) => sum + hours, 0).toFixed(1)}h / {studyStats.weeklyGoal}h
                      </span>
                    </div>
                    <Progress 
                      value={(studyStats.weeklyProgress.reduce((sum, hours) => sum + hours, 0) / studyStats.weeklyGoal) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          insight.type === 'success' ? 'bg-green-100 text-green-600' :
                          insight.type === 'info' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
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
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority === 'high' ? 'Priorité haute' : 'Recommandé'}
                          </Badge>
                          <Button size="sm">{rec.action}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Excellent travail !</h3>
                    <p className="text-muted-foreground">
                      Vous êtes sur la bonne voie. Continuez comme ça !
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;