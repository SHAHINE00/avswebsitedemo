import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';
import { useEnhancedLearning, Quiz, QuizQuestion } from '@/hooks/useEnhancedLearning';

interface QuizPlayerProps {
  lessonId: string;
  onQuizComplete: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ lessonId, onQuizComplete }) => {
  const { fetchQuizzes, fetchQuizQuestions, submitQuizAttempt, loading } = useEnhancedLearning();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    loadQuizzes();
  }, [lessonId]);

  useEffect(() => {
    if (selectedQuiz && selectedQuiz.time_limit_minutes && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, selectedQuiz]);

  const loadQuizzes = async () => {
    const quizzesData = await fetchQuizzes(lessonId);
    setQuizzes(quizzesData);
    if (quizzesData.length > 0) {
      setSelectedQuiz(quizzesData[0]);
    }
  };

  const startQuiz = async () => {
    if (!selectedQuiz) return;

    const questionsData = await fetchQuizQuestions(selectedQuiz.id);
    setQuestions(questionsData);
    setQuizStarted(true);
    setStartTime(Date.now());
    
    if (selectedQuiz.time_limit_minutes) {
      setTimeLeft(selectedQuiz.time_limit_minutes * 60);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedQuiz) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    await submitQuizAttempt(selectedQuiz.id, answers, timeSpent);
    setQuizCompleted(true);
    onQuizComplete();
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];

    switch (question.question_type) {
      case 'multiple_choice':
        const options = question.options as string[];
        return (
          <RadioGroup
            value={userAnswer || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={userAnswer || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`}>Vrai</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`}>Faux</Label>
            </div>
          </RadioGroup>
        );

      case 'short_answer':
        return (
          <Textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Votre réponse..."
            rows={3}
          />
        );

      default:
        return (
          <Input
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Votre réponse..."
          />
        );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Aucun quiz disponible pour cette leçon.</p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Award className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz terminé!</h3>
          <p className="text-muted-foreground">
            Votre tentative a été enregistrée. Consultez vos résultats dans votre tableau de bord.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {selectedQuiz?.title}
          </CardTitle>
          {selectedQuiz?.description && (
            <p className="text-muted-foreground">{selectedQuiz.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {selectedQuiz?.passing_score}%
                </div>
                <div className="text-sm text-muted-foreground">Score requis</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {selectedQuiz?.max_attempts}
                </div>
                <div className="text-sm text-muted-foreground">Tentatives max</div>
              </div>
            </div>
            
            {selectedQuiz?.time_limit_minutes && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Temps limité: {selectedQuiz.time_limit_minutes} minutes
                </span>
              </div>
            )}

            <Button onClick={startQuiz} className="w-full" disabled={loading}>
              Commencer le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestionIndex + 1} sur {questions.length}
          </CardTitle>
          {timeLeft !== null && (
            <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        {currentQuestion && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h3>
              {renderQuestion(currentQuestion)}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>

              <div className="text-sm text-muted-foreground">
                {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestion.id]}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizPlayer;