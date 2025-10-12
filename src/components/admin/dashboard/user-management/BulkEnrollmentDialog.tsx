import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses } from '@/hooks/useCourses';
import { Loader2 } from 'lucide-react';

interface BulkEnrollmentDialogProps {
  selectedUserIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnroll: (courseId: string) => Promise<void>;
  onUnenroll: (courseId: string) => Promise<void>;
  loading?: boolean;
}

export const BulkEnrollmentDialog: React.FC<BulkEnrollmentDialogProps> = ({
  selectedUserIds,
  open,
  onOpenChange,
  onEnroll,
  onUnenroll,
  loading = false
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [actionType, setActionType] = useState<'enroll' | 'unenroll'>('enroll');
  const { courses, loading: coursesLoading } = useCourses();

  const handleSubmit = async () => {
    if (!selectedCourse) return;
    
    if (actionType === 'enroll') {
      await onEnroll(selectedCourse);
    } else {
      await onUnenroll(selectedCourse);
    }
    
    setSelectedCourse('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestion des inscriptions en masse</DialogTitle>
          <DialogDescription>
            {selectedUserIds.length} utilisateur(s) sélectionné(s)
          </DialogDescription>
        </DialogHeader>

        <Tabs value={actionType} onValueChange={(v) => setActionType(v as 'enroll' | 'unenroll')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enroll">Inscrire</TabsTrigger>
            <TabsTrigger value="unenroll">Désinscrire</TabsTrigger>
          </TabsList>

          <TabsContent value="enroll" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="course-select">Sélectionner un cours</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course-select">
                  <SelectValue placeholder="Choisir un cours..." />
                </SelectTrigger>
                <SelectContent>
                  {coursesLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : courses.length === 0 ? (
                    <SelectItem value="none" disabled>Aucun cours disponible</SelectItem>
                  ) : (
                    courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="unenroll" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="course-select-unenroll">Sélectionner un cours</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course-select-unenroll">
                  <SelectValue placeholder="Choisir un cours..." />
                </SelectTrigger>
                <SelectContent>
                  {coursesLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : courses.length === 0 ? (
                    <SelectItem value="none" disabled>Aucun cours disponible</SelectItem>
                  ) : (
                    courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedCourse || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionType === 'enroll' ? 'Inscrire' : 'Désinscrire'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
