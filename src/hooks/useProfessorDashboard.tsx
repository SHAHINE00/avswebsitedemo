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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    try {
      // Get professor ID first
      const currentUser = (await supabase.auth.getUser()).data.user;
      console.log('Fetching courses for user:', currentUser?.email);
      
      const { data: professor, error: profError } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', currentUser?.id)
        .maybeSingle();

      console.log('Professor lookup result:', professor, 'Error:', profError);

      if (profError) {
        throw new Error(`Professor lookup failed: ${profError.message}`);
      }

      if (!professor) {
        throw new Error('Professor record not found. Please contact admin.');
      }

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

      console.log('Teaching assignments:', assignments);

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

      console.log('Courses with counts:', coursesWithCounts);
      setCourses(coursesWithCounts);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.message || 'Impossible de charger les cours');
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les cours",
        variant: "destructive",
      });
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchStats(), fetchCourses()]);
    } catch (err: any) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    courses,
    loading,
    error,
    refetchStats: fetchStats,
    refetchCourses: fetchCourses,
    refetchAll: fetchDashboardData
  };
};