import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useCourseClasses, CourseClass } from '@/hooks/useCourseClasses';
import { Loader2, Users, UserMinus, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Student {
  id: string;
  full_name: string;
  email: string;
  current_class?: string;
  enrolled_at?: string;
}

interface ClassStudent {
  id: string;
  full_name: string;
  email: string;
  enrolled_at: string;
}

interface AssignStudentsToClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  selectedClass: CourseClass;
}

export const AssignStudentsToClassDialog: React.FC<AssignStudentsToClassDialogProps> = ({
  open,
  onOpenChange,
  courseId,
  selectedClass,
}) => {
  const { assignStudentsToClass, removeStudentFromClass } = useCourseClasses(courseId);
  const [students, setStudents] = useState<Student[]>([]);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchingClass, setFetchingClass] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<ClassStudent | null>(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    if (open) {
      fetchClassStudents();
      fetchEnrolledStudents();
      setSelectedStudents([]);
      setActiveTab('current');
    }
  }, [open, courseId, selectedClass.id]);

  const fetchClassStudents = async () => {
    setFetchingClass(true);
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          user_id,
          enrolled_at,
          profiles(full_name, email)
        `)
        .eq('course_id', courseId)
        .eq('class_id', selectedClass.id);

      if (error) throw error;

      const studentsList: ClassStudent[] = (data || []).map((enrollment: any) => ({
        id: enrollment.user_id,
        full_name: enrollment.profiles?.full_name || 'N/A',
        email: enrollment.profiles?.email || 'N/A',
        enrolled_at: enrollment.enrolled_at,
      }));

      setClassStudents(studentsList);
    } catch (error) {
      console.error('Error fetching class students:', error);
    } finally {
      setFetchingClass(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          user_id,
          class_id,
          profiles(full_name, email),
          course_classes(class_name)
        `)
        .eq('course_id', courseId)
        .or(`class_id.is.null,class_id.neq.${selectedClass.id}`);

      if (error) throw error;

      const studentsList: Student[] = (data || []).map((enrollment: any) => ({
        id: enrollment.user_id,
        full_name: enrollment.profiles?.full_name || 'N/A',
        email: enrollment.profiles?.email || 'N/A',
        current_class: enrollment.course_classes?.class_name || 'Non assigné',
      }));

      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) return;

    const availableSpots = selectedClass.max_students - selectedClass.current_students;
    if (selectedStudents.length > availableSpots) {
      return;
    }

    setLoading(true);
    try {
      const success = await assignStudentsToClass(selectedClass.id, selectedStudents);
      if (success) {
        setSelectedStudents([]);
        await fetchClassStudents();
        await fetchEnrolledStudents();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    setLoading(true);
    try {
      const success = await removeStudentFromClass(selectedClass.id, studentToRemove.id);
      if (success) {
        await fetchClassStudents();
        await fetchEnrolledStudents();
      }
    } finally {
      setLoading(false);
      setStudentToRemove(null);
    }
  };

  const availableSpots = selectedClass.max_students - selectedClass.current_students;
  const isClassFull = availableSpots <= 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestion de la classe
            </DialogTitle>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Classe: <span className="font-medium">{selectedClass.class_name}</span></p>
              <div className="flex items-center gap-2">
                <p>Capacité: {selectedClass.current_students}/{selectedClass.max_students} étudiants</p>
                {isClassFull && (
                  <Badge variant="destructive" className="text-xs">Complet</Badge>
                )}
                {availableSpots > 0 && availableSpots <= 5 && (
                  <Badge variant="outline" className="text-xs">{availableSpots} places restantes</Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current" className="gap-2">
                <Users className="w-4 h-4" />
                Étudiants de la classe ({classStudents.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Ajouter des étudiants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {fetchingClass ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : classStudents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun étudiant dans cette classe
                  </p>
                ) : (
                  <div className="space-y-2">
                    {classStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{student.full_name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Inscrit le {new Date(student.enrolled_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStudentToRemove(student)}
                          disabled={loading}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {fetching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : students.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun étudiant disponible à ajouter
                  </p>
                ) : (
                  <div className="space-y-2">
                    {isClassFull && (
                      <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                        La classe est complète. Impossible d'ajouter de nouveaux étudiants.
                      </div>
                    )}
                    {students.map((student) => {
                      const wouldExceedCapacity = selectedStudents.length >= availableSpots;
                      const isDisabled = isClassFull || (wouldExceedCapacity && !selectedStudents.includes(student.id));
                      
                      return (
                        <div
                          key={student.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                        >
                          <Checkbox
                            id={student.id}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleToggleStudent(student.id)}
                            disabled={isDisabled}
                          />
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={student.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {student.full_name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                            <Badge variant="outline" className="text-xs">
                              {student.current_class}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <DialogFooter className="mt-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    {selectedStudents.length} étudiant(s) sélectionné(s)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleAssign}
                      disabled={loading || selectedStudents.length === 0 || isClassFull}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Assigner
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!studentToRemove} onOpenChange={(open) => !open && setStudentToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer l'étudiant de la classe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer <strong>{studentToRemove?.full_name}</strong> de cette classe ?
              L'étudiant restera inscrit au cours mais ne sera plus assigné à cette classe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveStudent} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
