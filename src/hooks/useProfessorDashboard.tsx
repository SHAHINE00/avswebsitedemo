import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfessorStats {
  total_courses: number;
  total_students: number;
  attendance_rate: number;
  average_grade: number;
  recent_announcements: number;
}

export interface AssignedCourse {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  total_students: number;
}

export const useProfessorDashboard = () => {
  const [stats, setStats] = useState<ProfessorStats | null>(null);
  const [courses, setCourses] = useState<AssignedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_professor_dashboard_stats');

      if (error) throw error;
      if (data) {
        setStats(data as unknown as ProfessorStats);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Get professor ID first
      const { data: professor } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!professor) throw new Error('Professor not found');

      // Get assigned courses
      const { data: assignments, error } = await supabase
        .from('teaching_assignments')
        .select(`
          course_id,
          courses (
            id,
            title,
            subtitle,
            status
          )
        `)
        .eq('professor_id', professor.id);

      if (error) throw error;

      // Get student counts for each course
      const coursesWithCounts = await Promise.all(
        (assignments || []).map(async (assignment: any) => {
          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', assignment.courses.id);

          return {
            ...assignment.courses,
            total_students: count || 0
          };
        })
      );

      setCourses(coursesWithCounts);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCourses();
  }, []);

  return {
    stats,
    courses,
    loading,
    refetchStats: fetchStats,
    refetchCourses: fetchCourses
  };
};