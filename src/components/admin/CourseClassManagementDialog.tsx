import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCourseClasses, CourseClass } from '@/hooks/useCourseClasses';
import { useProfessors } from '@/hooks/useProfessors';
import { Loader2 } from 'lucide-react';

interface CourseClassManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseName: string;
  editClass?: CourseClass | null;
}

export const CourseClassManagementDialog: React.FC<CourseClassManagementDialogProps> = ({
  open,
  onOpenChange,
  courseId,
  courseName,
  editClass,
}) => {
  const { createClass, updateClass } = useCourseClasses(courseId);
  const { professors } = useProfessors();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    class_name: '',
    class_code: '',
    professor_id: '',
    max_students: 30,
    academic_year: '',
    semester: '',
    start_date: '',
    end_date: '',
    notes: '',
  });

  useEffect(() => {
    if (editClass) {
      setFormData({
        class_name: editClass.class_name || '',
        class_code: editClass.class_code || '',
        professor_id: editClass.professor_id || '',
        max_students: editClass.max_students || 30,
        academic_year: editClass.academic_year || '',
        semester: editClass.semester || '',
        start_date: editClass.start_date || '',
        end_date: editClass.end_date || '',
        notes: editClass.notes || '',
      });
    } else {
      setFormData({
        class_name: '',
        class_code: '',
        professor_id: '',
        max_students: 30,
        academic_year: '',
        semester: '',
        start_date: '',
        end_date: '',
        notes: '',
      });
    }
  }, [editClass, open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const classData = {
        ...formData,
        course_id: courseId,
        professor_id: formData.professor_id || null,
      };

      const success = editClass
        ? await updateClass(editClass.id, classData)
        : await createClass(classData);

      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editClass ? 'Modifier la classe' : 'Créer une nouvelle classe'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Cours: {courseName}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="class_name">Nom de la classe *</Label>
            <Input
              id="class_name"
              placeholder="ex: Classe A - Matin, Groupe 1, Batch 2025-A"
              value={formData.class_name}
              onChange={(e) =>
                setFormData({ ...formData, class_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_code">Code de la classe</Label>
            <Input
              id="class_code"
              placeholder="ex: AI-M1, PROG-E2"
              value={formData.class_code}
              onChange={(e) =>
                setFormData({ ...formData, class_code: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professeur assigné (optionnel)</Label>
            <Select
              value={formData.professor_id}
              onValueChange={(value) =>
                setFormData({ ...formData, professor_id: value })
              }
            >
              <SelectTrigger id="professor">
                <SelectValue placeholder="Sélectionner un professeur (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {professors
                  .filter((p) => p.status === 'active')
                  .map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.full_name} ({prof.email})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_students">Capacité maximale</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_students: parseInt(e.target.value) || 30,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Année académique</Label>
              <Input
                id="academic_year"
                placeholder="ex: 2025-2026"
                value={formData.academic_year}
                onChange={(e) =>
                  setFormData({ ...formData, academic_year: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre (optionnel)</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) =>
                  setFormData({ ...formData, semester: value })
                }
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Sélectionner un semestre (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Automne</SelectItem>
                  <SelectItem value="Spring">Printemps</SelectItem>
                  <SelectItem value="Summer">Été</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes additionnelles sur la classe..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.class_name}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editClass ? 'Mettre à jour' : 'Créer la classe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
