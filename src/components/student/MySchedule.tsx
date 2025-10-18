import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { QRScanner } from './QRScanner';

interface UpcomingSession {
  session_id: string;
  course_id: string;
  course_title: string;
  professor_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room_location: string;
  session_type: string;
  status: string;
}

export const MySchedule: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    if (user) fetchUpcomingSessions();
  }, [user]);

  const fetchUpcomingSessions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_student_upcoming_sessions', {
        p_student_id: user?.id,
        p_days_ahead: 7
      });
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (sessions: UpcomingSession[]) => {
    const groups: { [date: string]: UpcomingSession[] } = {};
    sessions.forEach(session => {
      if (!groups[session.session_date]) {
        groups[session.session_date] = [];
      }
      groups[session.session_date].push(session);
    });
    return groups;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const sessionGroups = groupByDate(sessions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon emploi du temps</CardTitle>
        <CardDescription>Vos prochaines séances de cours</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Chargement...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-muted-foreground">Aucune séance prévue</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(sessionGroups).map(([date, dateSessions]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold capitalize">{formatDate(date)}</h3>
                </div>
                <div className="space-y-3">
                  {dateSessions.map((session) => (
                    <div key={session.session_id} className="ml-6 p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{session.course_title}</h4>
                          <p className="text-sm text-muted-foreground">{session.professor_name}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{session.start_time} - {session.end_time}</span>
                            </div>
                            {session.room_location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span>{session.room_location}</span>
                              </div>
                            )}
                            <span className="capitalize text-muted-foreground">{session.session_type}</span>
                          </div>
                        </div>
                        {session.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => setScannerOpen(true)}
                            className="flex items-center gap-1"
                          >
                            <QrCode className="h-4 w-4" />
                            Scanner
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <QRScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSuccess={() => fetchUpcomingSessions()}
      />
    </Card>
  );
};
