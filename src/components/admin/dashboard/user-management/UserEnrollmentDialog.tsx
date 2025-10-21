import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useAdminEnrollments, UserEnrollment } from '@/hooks/useAdminEnrollments';
import { Skeleton } from '@/components/ui/skeleton';

// Use the shared UserProfile interface from useUserManagement
import type { UserProfile } from './hooks/useUserManagement';

interface UserEnrollmentDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserEnrollmentDialog: React.FC<UserEnrollmentDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  
  const {
    loading,
    courses,
    getUserEnrollments,
    enrollUserInCourse,
    unenrollUserFromCourse,
  } = useAdminEnrollments();

  useEffect(() => {
    if (user && open) {
      fetchUserEnrollments();
    }
  }, [user, open]);

  const fetchUserEnrollments = async () => {
    if (!user) return;
    
    setLoadingEnrollments(true);
    try {
      const userEnrollments = await getUserEnrollments(user.id);
      setEnrollments(userEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !selectedCourse) return;
    
    const success = await enrollUserInCourse(user.id, selectedCourse);
    if (success) {
      setSelectedCourse('');
      fetchUserEnrollments();
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!user) return;
    
    const success = await unenrollUserFromCourse(user.id, courseId);
    if (success) {
      fetchUserEnrollments();
    }
  };

  const availableCourses = courses.filter(
    course => !enrollments.some(enrollment => enrollment.course_id === course.id)
  );

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Gestion des Inscriptions - {user.full_name || user.email}
          </DialogTitle>
          <DialogDescription>
            Gérez les inscriptions aux cours pour cet utilisateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Enrollment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inscrire à un nouveau cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleEnroll}
                  disabled={!selectedCourse || loading}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Inscrire
                </Button>
              </div>
              {availableCourses.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Aucun cours disponible pour inscription
                </p>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Current Enrollments */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Inscriptions actuelles</h3>
            
            {loadingEnrollments ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune inscription trouvée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.enrollment_id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-medium">{enrollment.course_title}</h4>
                            <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                              {enrollment.status}
                            </Badge>
                            {enrollment.class_name ? (
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                Classe: {enrollment.class_name}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Non assigné à une classe
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              Progression: {enrollment.progress_percentage}%
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnenroll(enrollment.course_id)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};