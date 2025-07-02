import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { CourseLesson } from '@/hooks/useCourseContent';

interface LessonsTabProps {
  lessons: CourseLesson[];
  onEditLesson: (lesson: CourseLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onCreateLesson: () => void;
  onReorderLessons: () => void;
}

const LessonsTab = ({ 
  lessons, 
  onEditLesson, 
  onDeleteLesson, 
  onCreateLesson, 
  onReorderLessons 
}: LessonsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leçons du cours</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReorderLessons}
            className="flex items-center gap-2"
            disabled={lessons.length < 2}
          >
            <ArrowUpDown className="w-4 h-4" />
            Réorganiser
          </Button>
          <Button
            onClick={onCreateLesson}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle leçon
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                      {lesson.status}
                    </Badge>
                    {lesson.is_preview && (
                      <Badge variant="outline">Aperçu</Badge>
                    )}
                  </div>
                  {lesson.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {lesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Ordre: {lesson.lesson_order}</span>
                    {lesson.duration_minutes && (
                      <span>Durée: {lesson.duration_minutes} min</span>
                    )}
                    {lesson.video_url && (
                      <Badge variant="outline">Vidéo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditLesson(lesson)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteLesson(lesson.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {lessons.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune leçon</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer la première leçon de ce cours.
              </p>
              <Button onClick={onCreateLesson}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une leçon
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LessonsTab;