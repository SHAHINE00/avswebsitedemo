import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  FileText,
  Bookmark
} from 'lucide-react';
// Real-time subscriptions handled at page level

interface ActivityItem {
  id: string;
  type: 'study_session' | 'achievement' | 'enrollment' | 'bookmark' | 'certificate';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: any;
}

const RealTimeActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Listen for various real-time events (subscriptions handled at page level)
    const handleStudySession = (event: CustomEvent) => {
      const { data } = event.detail;
      addActivity({
        id: `study-${data.id}`,
        type: 'study_session',
        title: 'Session d\'étude démarrée',
        description: `Durée: ${data.duration_minutes || 0} minutes`,
        timestamp: new Date(data.started_at),
        metadata: data
      });
    };

    const handleAchievement = (event: CustomEvent) => {
      const { data } = event.detail;
      addActivity({
        id: `achievement-${data.id}`,
        type: 'achievement',
        title: 'Nouveau succès débloqué!',
        description: data.achievement_title,
        timestamp: new Date(data.achieved_at),
        metadata: data
      });
    };

    const handleEnrollment = (event: CustomEvent) => {
      const { data } = event.detail;
      addActivity({
        id: `enrollment-${data.id}`,
        type: 'enrollment',
        title: 'Nouvelle inscription',
        description: 'Vous êtes inscrit à un nouveau cours',
        timestamp: new Date(data.enrolled_at),
        metadata: data
      });
    };

    const handleBookmark = (event: CustomEvent) => {
      const { data, type } = event.detail;
      if (type === 'insert') {
        addActivity({
          id: `bookmark-${data.id}`,
          type: 'bookmark',
          title: 'Cours ajouté aux favoris',
          description: 'Un cours a été ajouté à vos favoris',
          timestamp: new Date(data.created_at),
          metadata: data
        });
      }
    };

    const handleCertificate = (event: CustomEvent) => {
      const { data } = event.detail;
      addActivity({
        id: `certificate-${data.id}`,
        type: 'certificate',
        title: 'Nouveau certificat obtenu!',
        description: data.title,
        timestamp: new Date(data.issued_date),
        metadata: data
      });
    };

    window.addEventListener('studySessionUpdate', handleStudySession as EventListener);
    window.addEventListener('achievementUpdate', handleAchievement as EventListener);
    window.addEventListener('enrollmentUpdate', handleEnrollment as EventListener);
    window.addEventListener('bookmarkUpdate', handleBookmark as EventListener);
    window.addEventListener('certificateUpdate', handleCertificate as EventListener);

    return () => {
      window.removeEventListener('studySessionUpdate', handleStudySession as EventListener);
      window.removeEventListener('achievementUpdate', handleAchievement as EventListener);
      window.removeEventListener('enrollmentUpdate', handleEnrollment as EventListener);
      window.removeEventListener('bookmarkUpdate', handleBookmark as EventListener);
      window.removeEventListener('certificateUpdate', handleCertificate as EventListener);
    };
  }, []);

  const addActivity = (activity: ActivityItem) => {
    setActivities(prev => [activity, ...prev.slice(0, 9)]); // Keep only last 10 activities
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'study_session':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'enrollment':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4 text-purple-500" />;
      case 'certificate':
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'study_session':
        return 'bg-blue-50 border-blue-200';
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200';
      case 'enrollment':
        return 'bg-green-50 border-green-200';
      case 'bookmark':
        return 'bg-purple-50 border-purple-200';
      case 'certificate':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Activité en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune activité récente</p>
              <p className="text-sm">Commencez à étudier pour voir vos activités ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-sm truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatRelativeTime(activity.timestamp)}
                        </Badge>
                        {activity.type === 'achievement' && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivityFeed;