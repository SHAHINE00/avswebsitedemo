import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, DollarSign, Award, Mail, FileText } from 'lucide-react';
import { useStudentCRM } from '@/hooks/useStudentCRM';

interface StudentTimelineProps {
  userId: string;
}

const StudentTimeline: React.FC<StudentTimelineProps> = ({ userId }) => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStudentTimeline } = useStudentCRM();

  useEffect(() => {
    fetchTimeline();
  }, [userId]);

  const fetchTimeline = async () => {
    setLoading(true);
    const events = await getStudentTimeline(userId);
    setTimeline(events);
    setLoading(false);
  };

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, any> = {
      enrollment: BookOpen,
      payment: DollarSign,
      certificate: Award,
      communication: Mail,
      note: FileText
    };
    const Icon = icons[eventType] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  const getEventColor = (eventType: string) => {
    const colors: Record<string, string> = {
      enrollment: 'text-blue-600',
      payment: 'text-green-600',
      certificate: 'text-purple-600',
      communication: 'text-orange-600',
      note: 'text-gray-600'
    };
    return colors[eventType] || 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chronologie de l'Activité</CardTitle>
        <CardDescription>Historique complet des événements de l'étudiant</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : timeline.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune activité</p>
        ) : (
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={event.event_id} className="relative pl-8 pb-4">
                {index !== timeline.length - 1 && (
                  <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-border" />
                )}
                <div className={`absolute left-0 top-1 ${getEventColor(event.event_type)}`}>
                  {getEventIcon(event.event_type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{event.title}</p>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.event_date).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTimeline;
