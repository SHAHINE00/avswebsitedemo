
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logInfo, logError } from '@/utils/logger';

export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  modules: string | null;
  duration: string | null;
  diploma: string | null;
  feature1: string | null;
  feature2: string | null;
  icon: string;
  gradient_from: string;
  gradient_to: string;
  button_text_color: string;
  floating_color1: string;
  floating_color2: string;
  link_to: string | null;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  created_at: string;
  updated_at: string;
  view_count: number | null;
  last_viewed_at: string | null;
  certification_provider_name: string | null;
  certification_provider_logo: string | null;
  certification_recognition: string | null;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCourses = useCallback(async (attempt = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      logInfo(`[useCourses] Fetching courses (attempt ${attempt})`);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('display_order');

      if (error) {
        logError(`[useCourses] Supabase error:`, error);
        throw error;
      }

      logInfo(`[useCourses] Successfully fetched ${data?.length || 0} courses`);
      setCourses(data || []);
      setRetryCount(0);
    } catch (err: any) {
      logError(`[useCourses] Fetch failed (attempt ${attempt}):`, err);
      
      // Retry logic for temporary issues
      if (attempt < 3 && (err.message?.includes('schema cache') || err.message?.includes('404'))) {
        logInfo(`[useCourses] Retrying in ${attempt * 1000}ms...`);
        setTimeout(() => {
          setRetryCount(attempt);
          fetchCourses(attempt + 1);
        }, attempt * 1000);
        return;
      }
      
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchCourses(1);
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { 
    courses, 
    loading, 
    error, 
    retryCount,
    refetch: fetchCourses,
    retry 
  };
};
