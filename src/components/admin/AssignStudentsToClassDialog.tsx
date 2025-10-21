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
import { supabase } from '@/integrations/supabase/client';
import { useCourseClasses, CourseClass } from '@/hooks/useCourseClasses';
import { Loader2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  full_name: string;
  email: string;
  current_class?: string;
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
  const { assignStudentsToClass } = useCourseClasses(courseId);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEnrolledStudents();
    }
  }, [open, courseId]);

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
        .eq('course_id', courseId);

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

    setLoading(true);
    try {
      const success = await assignStudentsToClass(selectedClass.id, selectedStudents);
      if (success) {
        setSelectedStudents([]);
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assigner des étudiants à la classe
          </DialogTitle>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Classe: <span className="font-medium">{selectedClass.class_name}</span></p>
            <p>
              Capacité: {selectedClass.current_students}/{selectedClass.max_students} étudiants
            </p>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun étudiant inscrit à ce cours
            </p>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleToggleStudent(student.id)}
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
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
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
                disabled={loading || selectedStudents.length === 0}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assigner
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
