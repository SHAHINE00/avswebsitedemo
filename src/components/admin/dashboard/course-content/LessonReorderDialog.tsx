import React, { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CourseLesson } from '@/hooks/useCourseContent';

interface LessonReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lessons: CourseLesson[];
  onSuccess: () => void;
}

const LessonReorderDialog = ({ open, onOpenChange, courseId, lessons, onSuccess }: LessonReorderDialogProps) => {
  const [orderedLessons, setOrderedLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lessons.length > 0) {
      setOrderedLessons([...lessons].sort((a, b) => a.lesson_order - b.lesson_order));
    }
  }, [lessons]);

  const moveLesson = (fromIndex: number, toIndex: number) => {
    const newLessons = [...orderedLessons];
    const [movedLesson] = newLessons.splice(fromIndex, 1);
    newLessons.splice(toIndex, 0, movedLesson);
    setOrderedLessons(newLessons);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update lesson orders
      const updates = orderedLessons.map((lesson, index) => ({
        id: lesson.id,
        lesson_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('course_lessons')
          .update({ lesson_order: update.lesson_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      logError('Error reordering lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Réorganiser les leçons</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {orderedLessons.map((lesson, index) => (
            <Card key={lesson.id} className="cursor-move">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <Play className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <span className="font-medium">{index + 1}. {lesson.title}</span>
                    {lesson.duration_minutes && (
                      <span className="text-sm text-muted-foreground ml-2">
                        ({lesson.duration_minutes} min)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveLesson(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveLesson(index, Math.min(orderedLessons.length - 1, index + 1))}
                      disabled={index === orderedLessons.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Sauvegarder l\'ordre'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonReorderDialog;