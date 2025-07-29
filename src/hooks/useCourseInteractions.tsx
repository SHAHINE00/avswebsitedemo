import { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CourseBookmark {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
}

export interface CourseReview {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export const useCourseInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<CourseBookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBookmarks(data || []);
    } catch (error) {
      logError('Error fetching bookmarks:', error);
    }
  };

  const toggleBookmark = async (courseId: string) => {
    if (!user) return;

    try {
      const existingBookmark = bookmarks.find(b => b.course_id === courseId);

      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
          .from('course_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        if (error) throw error;

        setBookmarks(prev => prev.filter(b => b.id !== existingBookmark.id));
        toast({
          title: "Favori retiré",
          description: "Le cours a été retiré de vos favoris",
        });
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('course_bookmarks')
          .insert({
            user_id: user.id,
            course_id: courseId
          })
          .select()
          .single();

        if (error) throw error;

        setBookmarks(prev => [data, ...prev]);
        toast({
          title: "Favori ajouté",
          description: "Le cours a été ajouté à vos favoris",
        });
      }
    } catch (error) {
      logError('Error toggling bookmark:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    }
  };

  const isBookmarked = (courseId: string) => {
    return bookmarks.some(b => b.course_id === courseId);
  };

  const submitReview = async (courseId: string, rating: number, reviewText?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          rating,
          review_text: reviewText,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Avis publié",
        description: "Merci pour votre avis sur ce cours",
      });

      return data;
    } catch (error) {
      logError('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'avis",
        variant: "destructive",
      });
    }
  };

  const getCourseReviews = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      logError('Error fetching course reviews:', error);
      return [];
    }
  };

  const getUserReview = async (courseId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      logError('Error fetching user review:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  return {
    bookmarks,
    loading,
    toggleBookmark,
    isBookmarked,
    submitReview,
    getCourseReviews,
    getUserReview,
    fetchBookmarks,
  };
};