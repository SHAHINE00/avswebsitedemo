import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Calendar, 
  BookOpen, 
  Award, 
  Target,
  Clock,
  TrendingUp,
  Settings,
  Check,
  X
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPreferences {
  courseReminders: boolean;
  studyStreakAlerts: boolean;
  achievementNotifications: boolean;
  deadlineWarnings: boolean;
  weeklyProgressReports: boolean;
  appointmentReminders: boolean;
  newContentAlerts: boolean;
  studyRecommendations: boolean;
}

interface SmartNotification {
  id: string;
  type: 'reminder' | 'achievement' | 'deadline' | 'streak' | 'recommendation';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled: Date;
  delivered: boolean;
  actionUrl?: string;
  metadata?: {
    courseId?: string;
    achievementId?: string;
    streakDays?: number;
  };
}

const SmartNotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    courseReminders: true,
    studyStreakAlerts: true,
    achievementNotifications: true,
    deadlineWarnings: true,
    weeklyProgressReports: true,
    appointmentReminders: true,
    newContentAlerts: false,
    studyRecommendations: true
  });

  // Mock smart notifications - replace with real data
  const [smartNotifications] = useState<SmartNotification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Session d\'étude programmée',
      message: 'Il est temps pour votre session d\'IA de 60 minutes',
      priority: 'medium',
      scheduled: new Date(Date.now() + 3600000),
      delivered: false,
      actionUrl: '/course/ai-fundamentals',
      metadata: { courseId: 'ai-fundamentals' }
    },
    {
      id: '2',
      type: 'streak',
      title: 'Série d\'étude en danger!',
      message: 'Vous n\'avez pas étudié aujourd\'hui. Maintenez votre série de 5 jours!',
      priority: 'high',
      scheduled: new Date(Date.now() + 1800000),
      delivered: false,
      metadata: { streakDays: 5 }
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Nouveau succès débloqué!',
      message: 'Félicitations! Vous avez complété 10 leçons cette semaine',
      priority: 'medium',
      scheduled: new Date(),
      delivered: true,
      metadata: { achievementId: 'weekly-warrior' }
    }
  ]);

  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'deadline': return <Calendar className="h-4 w-4" />;
      case 'streak': return <TrendingUp className="h-4 w-4" />;
      case 'recommendation': return <BookOpen className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge variant="default">Important</Badge>;
      case 'medium': return <Badge variant="secondary">Normal</Badge>;
      case 'low': return <Badge variant="outline">Faible</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // Save to backend
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centre de Notifications Intelligent</h2>
          <p className="text-muted-foreground">
            Restez informé de votre progression et ne manquez aucune opportunité d'apprentissage
          </p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          <Check className="h-4 w-4 mr-2" />
          Tout marquer comme lu
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications intelligentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications Intelligentes
            </CardTitle>
            <CardDescription>
              Notifications personnalisées basées sur votre comportement d'apprentissage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 rounded-lg ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium">{notification.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(notification.priority)}
                      {!notification.delivered && (
                        <Badge variant="outline">Programmée</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {notification.delivered 
                        ? `Envoyée ${notification.scheduled.toLocaleString()}`
                        : `Programmée pour ${notification.scheduled.toLocaleString()}`
                      }
                    </span>
                    {notification.actionUrl && (
                      <Button size="sm" variant="outline">
                        Voir le cours
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Préférences de notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences
            </CardTitle>
            <CardDescription>
              Personnalisez vos notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="course-reminders" className="text-sm">
                  Rappels de cours
                </Label>
                <Switch
                  id="course-reminders"
                  checked={preferences.courseReminders}
                  onCheckedChange={(checked) => updatePreference('courseReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="streak-alerts" className="text-sm">
                  Alertes de série d'étude
                </Label>
                <Switch
                  id="streak-alerts"
                  checked={preferences.studyStreakAlerts}
                  onCheckedChange={(checked) => updatePreference('studyStreakAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="achievement-notifications" className="text-sm">
                  Notifications de succès
                </Label>
                <Switch
                  id="achievement-notifications"
                  checked={preferences.achievementNotifications}
                  onCheckedChange={(checked) => updatePreference('achievementNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="deadline-warnings" className="text-sm">
                  Alertes d'échéances
                </Label>
                <Switch
                  id="deadline-warnings"
                  checked={preferences.deadlineWarnings}
                  onCheckedChange={(checked) => updatePreference('deadlineWarnings', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-reports" className="text-sm">
                  Rapports hebdomadaires
                </Label>
                <Switch
                  id="weekly-reports"
                  checked={preferences.weeklyProgressReports}
                  onCheckedChange={(checked) => updatePreference('weeklyProgressReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="appointment-reminders" className="text-sm">
                  Rappels de rendez-vous
                </Label>
                <Switch
                  id="appointment-reminders"
                  checked={preferences.appointmentReminders}
                  onCheckedChange={(checked) => updatePreference('appointmentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="new-content" className="text-sm">
                  Nouveau contenu
                </Label>
                <Switch
                  id="new-content"
                  checked={preferences.newContentAlerts}
                  onCheckedChange={(checked) => updatePreference('newContentAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recommendations" className="text-sm">
                  Recommandations d'étude
                </Label>
                <Switch
                  id="recommendations"
                  checked={preferences.studyRecommendations}
                  onCheckedChange={(checked) => updatePreference('studyRecommendations', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques de notification */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Notification</CardTitle>
          <CardDescription>
            Votre historique d'engagement avec les notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">23</div>
              <p className="text-sm text-muted-foreground">Notifications cette semaine</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-sm text-muted-foreground">Taux de lecture</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-muted-foreground">Actions prises</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-sm text-muted-foreground">Rappels de série</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartNotificationCenter;