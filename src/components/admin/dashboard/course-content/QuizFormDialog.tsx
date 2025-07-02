import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Quiz, QuizQuestion } from '@/hooks/useEnhancedLearning';

interface QuizFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  quiz?: Quiz | null;
  onSuccess: () => void;
}

interface QuizFormData {
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  is_active: boolean;
}

interface QuestionFormData {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string;
  points: number;
  explanation: string;
}

const QuizFormDialog: React.FC<QuizFormDialogProps> = ({
  open,
  onOpenChange,
  lessonId,
  quiz,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizFormData>({
    title: '',
    description: '',
    passing_score: 70,
    max_attempts: 3,
    time_limit_minutes: null,
    is_active: true
  });
  const [questions, setQuestions] = useState<QuestionFormData[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    points: 1,
    explanation: ''
  });

  useEffect(() => {
    if (quiz) {
      setQuizData({
        title: quiz.title,
        description: quiz.description || '',
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        time_limit_minutes: quiz.time_limit_minutes,
        is_active: quiz.is_active
      });
      loadQuestions();
    } else {
      resetForm();
    }
  }, [quiz]);

  const loadQuestions = async () => {
    if (!quiz) return;

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('question_order');

      if (error) throw error;

      const formattedQuestions = data.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type as 'multiple_choice' | 'true_false' | 'short_answer',
        options: Array.isArray(q.options) ? q.options as string[] : [],
        correct_answer: q.correct_answer,
        points: q.points,
        explanation: q.explanation || ''
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const resetForm = () => {
    setQuizData({
      title: '',
      description: '',
      passing_score: 70,
      max_attempts: 3,
      time_limit_minutes: null,
      is_active: true
    });
    setQuestions([]);
    setShowQuestionForm(false);
    setEditingQuestionIndex(null);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: ''
    });
  };

  const addOrUpdateQuestion = () => {
    if (!questionForm.question_text.trim() || !questionForm.correct_answer.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au minimum la question et la réponse correcte",
        variant: "destructive",
      });
      return;
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = { ...questionForm };
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, { ...questionForm }]);
    }

    resetQuestionForm();
    setShowQuestionForm(false);
  };

  const editQuestion = (index: number) => {
    setQuestionForm({ ...questions[index] });
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    if (!quizData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du quiz est requis",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Erreur",
        description: "Ajoutez au moins une question au quiz",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let quizId: string;

      if (quiz) {
        // Update existing quiz
        const { error } = await supabase
          .from('quizzes')
          .update({
            title: quizData.title,
            description: quizData.description || null,
            passing_score: quizData.passing_score,
            max_attempts: quizData.max_attempts,
            time_limit_minutes: quizData.time_limit_minutes,
            is_active: quizData.is_active
          })
          .eq('id', quiz.id);

        if (error) throw error;

        // Delete existing questions
        await supabase
          .from('quiz_questions')
          .delete()
          .eq('quiz_id', quiz.id);

        quizId = quiz.id;
      } else {
        // Create new quiz
        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            lesson_id: lessonId,
            title: quizData.title,
            description: quizData.description || null,
            passing_score: quizData.passing_score,
            max_attempts: quizData.max_attempts,
            time_limit_minutes: quizData.time_limit_minutes,
            is_active: quizData.is_active
          })
          .select()
          .single();

        if (error) throw error;
        quizId = data.id;
      }

      // Insert questions
      const questionsToInsert = questions.map((question, index) => ({
        quiz_id: quizId,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.question_type === 'multiple_choice' ? question.options.filter(o => o.trim()) : null,
        correct_answer: question.correct_answer,
        points: question.points,
        question_order: index + 1,
        explanation: question.explanation || null
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast({
        title: quiz ? "Quiz modifié" : "Quiz créé",
        description: `Le quiz "${quizData.title}" a été ${quiz ? 'modifié' : 'créé'} avec succès`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quiz ? 'Modifier le quiz' : 'Créer un nouveau quiz'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quiz Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  placeholder="Titre du quiz"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  placeholder="Description du quiz (optionnel)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passing_score">Score requis (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min="0"
                    max="100"
                    value={quizData.passing_score}
                    onChange={(e) => setQuizData({ ...quizData, passing_score: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="max_attempts">Tentatives maximum</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    min="1"
                    value={quizData.max_attempts}
                    onChange={(e) => setQuizData({ ...quizData, max_attempts: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="time_limit">Limite de temps (minutes, optionnel)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  min="1"
                  value={quizData.time_limit_minutes || ''}
                  onChange={(e) => setQuizData({ 
                    ...quizData, 
                    time_limit_minutes: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  placeholder="Aucune limite"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={quizData.is_active}
                  onCheckedChange={(checked) => setQuizData({ ...quizData, is_active: checked })}
                />
                <Label htmlFor="is_active">Quiz actif</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({questions.length})</CardTitle>
                <Button
                  onClick={() => {
                    resetQuestionForm();
                    setEditingQuestionIndex(null);
                    setShowQuestionForm(true);
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Form */}
              {showQuestionForm && (
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {editingQuestionIndex !== null ? 'Modifier la question' : 'Nouvelle question'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question_text">Question</Label>
                      <Textarea
                        id="question_text"
                        value={questionForm.question_text}
                        onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                        placeholder="Tapez votre question ici..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="question_type">Type de question</Label>
                        <select
                          id="question_type"
                          value={questionForm.question_type}
                          onChange={(e) => setQuestionForm({ 
                            ...questionForm, 
                            question_type: e.target.value as any,
                            options: e.target.value === 'multiple_choice' ? ['', '', '', ''] : []
                          })}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="multiple_choice">Choix multiple</option>
                          <option value="true_false">Vrai/Faux</option>
                          <option value="short_answer">Réponse courte</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          type="number"
                          min="1"
                          value={questionForm.points}
                          onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>

                    {/* Options for multiple choice */}
                    {questionForm.question_type === 'multiple_choice' && (
                      <div>
                        <Label>Options de réponse</Label>
                        <div className="space-y-2">
                          {questionForm.options.map((option, index) => (
                            <Input
                              key={index}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...questionForm.options];
                                newOptions[index] = e.target.value;
                                setQuestionForm({ ...questionForm, options: newOptions });
                              }}
                              placeholder={`Option ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="correct_answer">Réponse correcte</Label>
                      {questionForm.question_type === 'multiple_choice' ? (
                        <select
                          id="correct_answer"
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="">Sélectionnez la bonne réponse</option>
                          {questionForm.options.filter(o => o.trim()).map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : questionForm.question_type === 'true_false' ? (
                        <select
                          id="correct_answer"
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="true">Vrai</option>
                          <option value="false">Faux</option>
                        </select>
                      ) : (
                        <Input
                          id="correct_answer"
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          placeholder="Réponse correcte"
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="explanation">Explication (optionnel)</Label>
                      <Textarea
                        id="explanation"
                        value={questionForm.explanation}
                        onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                        placeholder="Explication à afficher après la réponse..."
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowQuestionForm(false);
                          setEditingQuestionIndex(null);
                          resetQuestionForm();
                        }}
                      >
                        Annuler
                      </Button>
                      <Button onClick={addOrUpdateQuestion}>
                        {editingQuestionIndex !== null ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Questions List */}
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Q{index + 1}</Badge>
                            <Badge variant="secondary">{question.question_type}</Badge>
                            <Badge>{question.points} pt{question.points > 1 ? 's' : ''}</Badge>
                          </div>
                          <p className="font-medium mb-1">{question.question_text}</p>
                          <p className="text-sm text-muted-foreground">
                            Réponse: {question.correct_answer}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(index, 'down')}
                            disabled={index === questions.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editQuestion(index)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sauvegarde...' : (quiz ? 'Modifier' : 'Créer')} le quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizFormDialog;