import React from 'react';
import { X, Users, Calendar, TrendingUp, ExternalLink, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClassDetails } from '@/hooks/useClassDetails';
import { useClassStats } from '@/hooks/useClassStats';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseClass } from '@/hooks/useCourseClasses';

interface ClassQuickViewPanelProps {
  classData: CourseClass;
  onClose: () => void;
  onEdit: () => void;
  onAssignStudents: () => void;
}

export const ClassQuickViewPanel: React.FC<ClassQuickViewPanelProps> = ({
  classData,
  onClose,
  onEdit,
  onAssignStudents,
}) => {
  const { students, sessions, loading: detailsLoading } = useClassDetails(classData.id);
  const { stats, loading: statsLoading } = useClassStats(classData.id);
  const navigate = useNavigate();

  const loading = detailsLoading || statsLoading;

  const topStudents = students
    .sort((a, b) => b.attendance_rate - a.attendance_rate)
    .slice(0, 5);

  const upcomingSessions = sessions
    .filter(s => new Date(s.session_date) > new Date())
    .slice(0, 3);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background border-l shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{classData.class_name}</h2>
          <p className="text-sm text-muted-foreground">{classData.course_name || classData.course?.title}</p>
          {classData.class_code && (
            <Badge variant="outline" className="mt-1">{classData.class_code}</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Étudiants</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Présence</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">{stats.averageGrade}%</div>
            <div className="text-sm text-muted-foreground">Moy. Générale</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
        </div>

        {/* Top Students */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <h3 className="font-medium">Meilleurs Étudiants</h3>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : topStudents.length > 0 ? (
            <div className="space-y-2">
              {topStudents.map((student, idx) => (
                <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                    {idx + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {student.full_name?.charAt(0) || student.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{student.full_name || student.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Présence: {student.attendance_rate.toFixed(0)}%
                    </div>
                  </div>
                  {student.average_grade !== null && (
                    <div className="text-sm font-medium">{student.average_grade.toFixed(0)}%</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun étudiant inscrit</p>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h3 className="font-medium">Prochaines Sessions</h3>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-2">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {new Date(session.session_date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.start_time} - {session.end_time}
                      </div>
                      {session.room_location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          📍 {session.room_location}
                        </div>
                      )}
                    </div>
                    <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune session à venir</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier la classe
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={onAssignStudents}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assigner des étudiants
          </Button>
          <Button 
            variant="default" 
            className="w-full justify-start"
            onClick={() => navigate(`/admin/classes/${classData.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir tous les détails
          </Button>
        </div>
      </div>
    </div>
  );
};
