
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('display_order');

      if (error) {
        setError(error.message);
      } else {
        setCourses(data || []);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};
