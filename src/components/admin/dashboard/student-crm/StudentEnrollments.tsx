import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { BookOpen, Plus, X } from 'lucide-react';
import { useAdminEnrollments } from '@/hooks/useAdminEnrollments';

interface StudentEnrollmentsProps {
  userId: string;
  detailed?: boolean;
}

const StudentEnrollments: React.FC<StudentEnrollmentsProps> = ({ userId, detailed = false }) => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [unenrollCourseId, setUnenrollCourseId] = useState<string>('');
  const { getUserEnrollments, enrollUserInCourse, unenrollUserFromCourse, courses, loading: coursesLoading } = useAdminEnrollments();

  useEffect(() => {
    fetchEnrollments();
  }, [userId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    const data = await getUserEnrollments(userId);
    setEnrollments(data);
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!selectedCourseId) return;
    const success = await enrollUserInCourse(userId, selectedCourseId);
    if (success) {
      await fetchEnrollments();
      setShowEnrollDialog(false);
      setSelectedCourseId('');
    }
  };

  const handleUnenroll = async () => {
    if (!unenrollCourseId) return;
    const success = await unenrollUserFromCourse(userId, unenrollCourseId);
    if (success) {
      await fetchEnrollments();
      setShowUnenrollDialog(false);
      setUnenrollCourseId('');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      completed: 'secondary',
      cancelled: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const availableCourses = courses.filter(
    course => !enrollments.some(e => e.course_id === course.id)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Cours Inscrits
            </CardTitle>
            <CardDescription>
              {enrollments.length} cours au total
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowEnrollDialog(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Inscrire à un Cours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune inscription</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.enrollment_id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <p className="font-medium">{enrollment.course_title}</p>
                    {getStatusBadge(enrollment.status)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUnenrollCourseId(enrollment.course_id);
                      setShowUnenrollDialog(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progression</span>
                    <span>{enrollment.progress_percentage}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} className="h-2" />
                </div>
                {detailed && (
                  <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>Inscrit le: {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}</p>
                    {enrollment.last_accessed_at && (
                      <p>Dernier accès: {new Date(enrollment.last_accessed_at).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Enroll Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscrire à un Cours</DialogTitle>
            <DialogDescription>
              Sélectionnez un cours pour inscrire cet étudiant
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un cours" />
              </SelectTrigger>
              <SelectContent>
                {coursesLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : availableCourses.length === 0 ? (
                  <SelectItem value="none" disabled>Aucun cours disponible</SelectItem>
                ) : (
                  availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEnroll} disabled={!selectedCourseId}>
              Inscrire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unenroll Confirmation Dialog */}
      <AlertDialog open={showUnenrollDialog} onOpenChange={setShowUnenrollDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la désinscription</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir désinscrire cet étudiant de ce cours ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnenroll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Désinscrire
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default StudentEnrollments;
