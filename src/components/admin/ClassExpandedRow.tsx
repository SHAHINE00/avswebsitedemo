import React from 'react';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useClassStats } from '@/hooks/useClassStats';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Users, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassExpandedRowProps {
  classId: string;
}

export const ClassExpandedRow: React.FC<ClassExpandedRowProps> = ({ classId }) => {
  const { students, sessions, loading: detailsLoading } = useClassDetails(classId);
  const { stats, loading: statsLoading } = useClassStats(classId);
  const navigate = useNavigate();

  const loading = detailsLoading || statsLoading;

  if (loading) {
    return (
      <div className="p-6 bg-muted/30 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const displayedStudents = students.slice(0, 10);
  const displayedSessions = sessions.slice(0, 5);

  return (
    <div className="p-6 bg-muted/30 border-t animate-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Students Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4" />
            <span>Étudiants ({stats.totalStudents})</span>
          </div>
          <div className="space-y-2">
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-2 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {student.full_name?.charAt(0) || student.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate">{student.full_name || student.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {student.attendance_rate.toFixed(0)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucun étudiant</p>
            )}
            {students.length > 10 && (
              <p className="text-xs text-muted-foreground">
                +{students.length - 10} autres étudiants
              </p>
            )}
          </div>
        </div>

        {/* Schedule Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            <span>Prochaines Sessions</span>
          </div>
          <div className="space-y-2">
            {displayedSessions.length > 0 ? (
              displayedSessions.map((session) => (
                <div key={session.id} className="text-sm flex justify-between items-center">
                  <span>{new Date(session.session_date).toLocaleDateString('fr-FR')}</span>
                  <span className="text-xs text-muted-foreground">
                    {session.start_time} - {session.end_time}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucune session</p>
            )}
            {sessions.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{sessions.length - 5} autres sessions
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Statistiques</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taux de présence</span>
              <span className="font-medium">{stats.attendanceRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Moyenne générale</span>
              <span className="font-medium">{stats.averageGrade}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sessions actives</span>
              <span className="font-medium">{stats.activeSessions}</span>
            </div>
            {stats.roomLocation && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Salle</span>
                <span className="font-medium">{stats.roomLocation}</span>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => navigate(`/admin/classes/${classId}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir tous les détails
          </Button>
        </div>
      </div>
    </div>
  );
};
