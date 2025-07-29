import React, { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCourseContent, CourseLesson } from '@/hooks/useCourseContent';

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lesson?: CourseLesson | null;
  onSuccess: () => void;
}

const LessonFormDialog = ({ open, onOpenChange, courseId, lesson, onSuccess }: LessonFormDialogProps) => {
  const { createLesson, updateLesson, lessons } = useCourseContent();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration_minutes: '',
    lesson_order: '',
    is_preview: false,
    status: 'draft' as 'draft' | 'published' | 'archived'
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        description: lesson.description || '',
        content: lesson.content,
        video_url: lesson.video_url || '',
        duration_minutes: lesson.duration_minutes?.toString() || '',
        lesson_order: lesson.lesson_order.toString(),
        is_preview: lesson.is_preview,
        status: lesson.status
      });
    } else {
      // Set default lesson order
      const maxOrder = Math.max(...lessons.map(l => l.lesson_order), 0);
      setFormData({
        title: '',
        description: '',
        content: '',
        video_url: '',
        duration_minutes: '',
        lesson_order: (maxOrder + 1).toString(),
        is_preview: false,
        status: 'draft'
      });
    }
  }, [lesson, lessons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lessonData = {
        course_id: courseId,
        title: formData.title,
        description: formData.description || null,
        content: formData.content,
        video_url: formData.video_url || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        lesson_order: parseInt(formData.lesson_order),
        is_preview: formData.is_preview,
        status: formData.status
      };

      if (lesson) {
        await updateLesson(lesson.id, lessonData);
      } else {
        await createLesson(lessonData);
      }

      onSuccess();
    } catch (error) {
      logError('Error saving lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Modifier la leçon' : 'Nouvelle leçon'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_order">Ordre</Label>
              <Input
                id="lesson_order"
                type="number"
                value={formData.lesson_order}
                onChange={(e) => setFormData({ ...formData, lesson_order: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video_url">URL Vidéo</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="duration_minutes">Durée (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_preview"
                checked={formData.is_preview}
                onCheckedChange={(checked) => setFormData({ ...formData, is_preview: checked })}
              />
              <Label htmlFor="is_preview">Aperçu gratuit</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : lesson ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonFormDialog;