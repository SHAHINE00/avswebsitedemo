import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseClass } from '@/hooks/useCourseClasses';
import { useClassStats } from '@/hooks/useClassStats';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Edit, Trash2, Eye, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { ClassExpandedRow } from './ClassExpandedRow';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassTableRowProps {
  classItem: CourseClass;
  showCourseColumn: boolean;
  onEdit: () => void;
  onAssignStudents: () => void;
  onDelete: () => void;
  onQuickView: () => void;
  getStatusBadgeVariant: (status: string) => any;
  getStatusLabel: (status: string) => string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ClassTableRow: React.FC<ClassTableRowProps> = ({
  classItem,
  showCourseColumn,
  onEdit,
  onAssignStudents,
  onDelete,
  onQuickView,
  getStatusBadgeVariant,
  getStatusLabel,
  isExpanded,
  onToggleExpand,
}) => {
  const { stats, loading } = useClassStats(classItem.id);
  const navigate = useNavigate();

  const getAttendanceBadgeVariant = (rate: number) => {
    if (rate >= 85) return 'default';
    if (rate >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <>
      <TableRow className="hover:bg-muted/30">
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        
        {showCourseColumn && (
          <TableCell>
            <Badge variant="outline">{classItem.course_name}</Badge>
          </TableCell>
        )}
        
        <TableCell>
          <div className="space-y-1">
            <p className="font-medium">{classItem.class_name}</p>
            {classItem.class_code && (
              <Badge variant="outline" className="text-xs">
                {classItem.class_code}
              </Badge>
            )}
          </div>
        </TableCell>
        
        <TableCell>
          <div className="flex items-center gap-2">
            {classItem.professor?.full_name ? (
              <>
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{classItem.professor.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {classItem.professor.email}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Non assigné
              </span>
            )}
          </div>
        </TableCell>
        
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                classItem.current_students >= classItem.max_students
                  ? 'destructive'
                  : classItem.current_students > classItem.max_students * 0.8
                  ? 'secondary'
                  : 'default'
              }
            >
              {classItem.current_students}/{classItem.max_students}
            </Badge>
            {classItem.current_students >= classItem.max_students && (
              <span className="text-xs text-destructive">Complet</span>
            )}
          </div>
        </TableCell>
        
        <TableCell>
          {classItem.academic_year ? (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm">
                <p>{classItem.academic_year}</p>
                {classItem.semester && (
                  <p className="text-xs text-muted-foreground">
                    {classItem.semester}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground italic">—</span>
          )}
        </TableCell>
        
        <TableCell>
          <Badge variant={getStatusBadgeVariant(classItem.status)}>
            {getStatusLabel(classItem.status)}
          </Badge>
        </TableCell>
        
        {/* New Columns */}
        <TableCell>
          {loading ? (
            <Skeleton className="h-4 w-16" />
          ) : stats.roomLocation ? (
            <span className="text-sm">{stats.roomLocation}</span>
          ) : (
            <span className="text-sm text-muted-foreground italic">—</span>
          )}
        </TableCell>
        
        <TableCell>
          {loading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <Badge variant="outline">
              {stats.activeSessions}/{stats.activeSessions + stats.upcomingSessions}
            </Badge>
          )}
        </TableCell>
        
        <TableCell>
          {loading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <Badge variant={getAttendanceBadgeVariant(stats.attendanceRate)}>
              {stats.attendanceRate}%
            </Badge>
          )}
        </TableCell>
        
        <TableCell>
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onQuickView}
              title="Vue rapide"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/admin/classes/${classItem.id}`)}
              title="Voir tous les détails"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAssignStudents}
              title="Gérer les étudiants"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              title="Supprimer"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={showCourseColumn ? 11 : 10} className="p-0">
            <ClassExpandedRow classId={classItem.id} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
