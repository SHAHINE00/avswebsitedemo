import React from 'react';
import { logError } from '@/utils/logger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Brain, Edit, Trash2 } from 'lucide-react';
import { CourseLesson } from '@/hooks/useCourseContent';
import { Quiz } from '@/hooks/useEnhancedLearning';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuizzesTabProps {
  quizzes: Quiz[];
  lessons: CourseLesson[];
  onCreateQuiz: () => void;
  onEditQuiz: (quiz: Quiz) => void;
  onRefreshContent: () => void;
}

const QuizzesTab = ({ 
  quizzes, 
  lessons, 
  onCreateQuiz, 
  onEditQuiz, 
  onRefreshContent 
}: QuizzesTabProps) => {
  const { toast } = useToast();

  const handleDeleteQuiz = async (quiz: Quiz) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      try {
        const { error } = await supabase
          .from('quizzes')
          .delete()
          .eq('id', quiz.id);
        if (error) throw error;
        onRefreshContent();
        toast({
          title: "Quiz supprimé",
          description: "Le quiz a été supprimé avec succès",
        });
      } catch (error) {
        logError('Error deleting quiz:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le quiz",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateQuizClick = () => {
    if (lessons.length > 0) {
      onCreateQuiz();
    } else {
      toast({
        title: "Aucune leçon disponible",
        description: "Créez d'abord des leçons avant d'ajouter des quiz",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quiz du cours</h3>
        <Button
          onClick={handleCreateQuizClick}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau quiz
        </Button>
      </div>

      <div className="grid gap-4">
        {quizzes.map((quiz) => {
          const lesson = lessons.find(l => l.id === quiz.lesson_id);
          return (
            <Card key={quiz.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{quiz.title}</h4>
                      <Badge variant={quiz.is_active ? 'default' : 'secondary'}>
                        {quiz.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    {quiz.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {quiz.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Leçon: {lesson?.title}</span>
                      <span>Score requis: {quiz.passing_score}%</span>
                      <span>Tentatives: {quiz.max_attempts}</span>
                      {quiz.time_limit_minutes && (
                        <span>Temps: {quiz.time_limit_minutes} min</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditQuiz(quiz)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {quizzes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun quiz</h3>
              <p className="text-muted-foreground mb-4">
                Créez des quiz pour évaluer vos étudiants.
              </p>
              <Button
                onClick={handleCreateQuizClick}
                disabled={lessons.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizzesTab;