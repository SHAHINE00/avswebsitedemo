import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  points: number;
  question_order: number;
  explanation: string | null;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number | null;
  max_score: number | null;
  passed: boolean | null;
  answers: any;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number | null;
}

export interface LessonNote {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  note_timestamp: number | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonDiscussion {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_pinned: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export const useEnhancedLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Quiz functionality
  const fetchQuizzes = async (lessonId: string): Promise<Quiz[]> => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  };

  const fetchQuizQuestions = async (quizId: string): Promise<QuizQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('question_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  };

  const submitQuizAttempt = async (
    quizId: string, 
    answers: any, 
    timeSpent: number
  ): Promise<QuizAttempt | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // First get the quiz questions to calculate score
      const questions = await fetchQuizQuestions(quizId);
      let score = 0;
      const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

      // Calculate score
      questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correct_answer) {
          score += question.points;
        }
      });

      // Get quiz info for passing score
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('passing_score')
        .eq('id', quizId)
        .single();

      const passed = quizData ? (score / maxScore * 100) >= quizData.passing_score : false;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          score,
          max_score: maxScore,
          passed,
          answers,
          completed_at: new Date().toISOString(),
          time_spent_seconds: timeSpent
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: passed ? "Quiz terminé avec succès!" : "Quiz terminé",
        description: `Score: ${score}/${maxScore} (${Math.round(score/maxScore*100)}%)`,
        variant: passed ? "default" : "destructive",
      });

      return data;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le quiz",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Notes functionality
  const fetchLessonNotes = async (lessonId: string): Promise<LessonNote[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('lesson_notes')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  };

  const createNote = async (
    lessonId: string, 
    content: string, 
    timestamp?: number
  ): Promise<LessonNote | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('lesson_notes')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content,
          note_timestamp: timestamp || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Note créée",
        description: "Votre note a été ajoutée avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la note",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNote = async (noteId: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .update({ content })
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note mise à jour",
        description: "Votre note a été modifiée avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la note",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note supprimée",
        description: "Votre note a été supprimée avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
      return false;
    }
  };

  // Discussions functionality
  const fetchLessonDiscussions = async (lessonId: string): Promise<LessonDiscussion[]> => {
    try {
      const { data, error } = await supabase
        .from('lesson_discussions')
        .select('*')
        .eq('lesson_id', lessonId)
        .is('parent_id', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching discussions:', error);
      return [];
    }
  };

  const fetchDiscussionReplies = async (parentId: string): Promise<LessonDiscussion[]> => {
    try {
      const { data, error } = await supabase
        .from('lesson_discussions')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  };

  const createDiscussion = async (
    lessonId: string, 
    content: string, 
    parentId?: string
  ): Promise<LessonDiscussion | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('lesson_discussions')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content,
          parent_id: parentId || null
        })
        .select('*')
        .single();

      if (error) throw error;

      toast({
        title: parentId ? "Réponse ajoutée" : "Discussion créée",
        description: "Votre message a été publié avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier le message",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDiscussion = async (discussionId: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lesson_discussions')
        .update({ content })
        .eq('id', discussionId);

      if (error) throw error;

      toast({
        title: "Message modifié",
        description: "Votre message a été mis à jour avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error updating discussion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le message",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDiscussion = async (discussionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lesson_discussions')
        .delete()
        .eq('id', discussionId);

      if (error) throw error;

      toast({
        title: "Message supprimé",
        description: "Votre message a été supprimé avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    // Quiz methods
    fetchQuizzes,
    fetchQuizQuestions,
    submitQuizAttempt,
    // Notes methods
    fetchLessonNotes,
    createNote,
    updateNote,
    deleteNote,
    // Discussion methods
    fetchLessonDiscussions,
    fetchDiscussionReplies,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
  };
};