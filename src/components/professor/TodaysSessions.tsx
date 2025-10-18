import React, { useEffect, useState } from 'react';
import { useClassSessions } from '@/hooks/useClassSessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TodaysSessionsProps {
  courseId: string;
}

export const TodaysSessions: React.FC<TodaysSessionsProps> = ({ courseId }) => {
  const { sessions, loading, fetchSessions, updateSession } = useClassSessions(courseId);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchSessions(today, today);
  }, [courseId]);

  const handleMarkAttendance = (sessionId: string) => {
    navigate(`/professor/course/${courseId}?tab=presences&session=${sessionId}`);
  };

  const handleStartSession = async (sessionId: string) => {
    await updateSession(sessionId, { status: 'in_progress' });
  };

  const handleEndSession = async (sessionId: string) => {
    await updateSession(sessionId, { status: 'completed' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Prévu';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Séances du jour</CardTitle>
        <CardDescription>Gérez vos séances d'aujourd'hui</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Chargement...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-muted-foreground">Aucune séance aujourd'hui</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{session.start_time} - {session.end_time}</span>
                      <Badge className={getStatusColor(session.status)}>{getStatusLabel(session.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {session.room_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{session.room_location}</span>
                        </div>
                      )}
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleStartSession(session.id)}>
                        Démarrer
                      </Button>
                    )}
                    {session.status === 'in_progress' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleMarkAttendance(session.id)}>
                          <Users className="mr-2 h-4 w-4" />Présences
                        </Button>
                        <Button size="sm" onClick={() => handleEndSession(session.id)}>
                          Terminer
                        </Button>
                      </>
                    )}
                    {session.status === 'completed' && !session.attendance_marked && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkAttendance(session.id)}>
                        Marquer présences
                      </Button>
                    )}
                  </div>
                </div>
                {session.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
