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
  const [professorRecordExists, setProfessorRecordExists] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Resolve ambiguity by explicitly passing professor id to the RPC
      const currentUser = (await supabase.auth.getUser()).data.user;
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      const { data: professor, error: profError } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (profError) {
        throw new Error(`Erreur lors de la recherche du profil professeur: ${profError.message}`);
      }

      if (!professor?.id) {
        // Mirror the behavior used elsewhere and surface a clear message
        setProfessorRecordExists(false);
        throw new Error('Professor record not found');
      }

      setProfessorRecordExists(true);

      const { data, error } = await supabase.rpc('get_professor_dashboard_stats', {
        _user_id: currentUser.id,
      });

      if (error) throw error;

      if (data) {
        setStats(data as unknown as ProfessorStats);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      const msg: string = error?.message || '';

      if (msg.includes('Professor record not found')) {
        setProfessorRecordExists(false);
        // Provide safe default stats so the page still renders
        setStats({
          total_courses: 0,
          total_students: 0,
          attendance_rate: 0,
          average_grade: 0,
          recent_announcements: 0,
        });
        setError("Votre profil professeur n'a pas été configuré");
        toast({
          title: 'Erreur',
          description: "Votre profil professeur n'a pas été configuré",
          variant: 'destructive',
        });
      } else if (msg.toLowerCase().includes('access denied')) {
        // Stats function not accessible to professor (likely admin-only version)
        // Do not block the page: show zeroed stats silently
        setProfessorRecordExists(true);
        setStats({
          total_courses: 0,
          total_students: 0,
          attendance_rate: 0,
          average_grade: 0,
          recent_announcements: 0,
        });
        setError(null);
      } else {
        setProfessorRecordExists(true);
        setError('Impossible de charger les statistiques');
        toast({
          title: 'Erreur',
          description: msg?.includes('Could not choose the best candidate function')
            ? 'Conflit de fonctions détecté, merci de réessayer'
            : 'Impossible de charger les statistiques',
          variant: 'destructive',
        });
      }
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
        setProfessorRecordExists(false);
        throw new Error(`Erreur lors de la recherche du profil professeur: ${profError.message}`);
      }

      if (!professor) {
        setProfessorRecordExists(false);
        throw new Error('Votre compte professeur n\'a pas été correctement configuré. Veuillez contacter l\'administrateur pour créer votre profil professeur.');
      }

      setProfessorRecordExists(true);

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
    professorRecordExists,
    refetchStats: fetchStats,
    refetchCourses: fetchCourses,
    refetchAll: fetchDashboardData
  };
};