import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch professor stats with React Query
  const { 
    data: statsData, 
    isLoading: statsLoading,
    error: statsError 
  } = useQuery<{ stats: ProfessorStats; professorRecordExists: boolean }>({
    queryKey: ['professor-stats'],
    queryFn: async () => {
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
        toast({
          title: 'Erreur',
          description: "Votre profil professeur n'a pas été configuré",
          variant: 'destructive',
        });
        return {
          stats: {
            total_courses: 0,
            total_students: 0,
            attendance_rate: 0,
            average_grade: 0,
            recent_announcements: 0,
          },
          professorRecordExists: false
        };
      }

      const { data, error } = await supabase.rpc('get_professor_dashboard_stats', {
        _user_id: currentUser.id,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('access denied')) {
          return {
            stats: {
              total_courses: 0,
              total_students: 0,
              attendance_rate: 0,
              average_grade: 0,
              recent_announcements: 0,
            },
            professorRecordExists: true
          };
        }
        
        if (error.message?.includes('Could not choose the best candidate function')) {
          toast({
            title: 'Erreur',
            description: 'Conflit de fonctions détecté, merci de réessayer',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les statistiques',
            variant: 'destructive',
          });
        }
        throw error;
      }

      return {
        stats: data as unknown as ProfessorStats,
        professorRecordExists: true
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const stats = statsData?.stats || null;
  const professorRecordExists = statsData?.professorRecordExists ?? true;

  // Fetch professor courses with React Query
  const { 
    data: courses = [], 
    isLoading: coursesLoading,
    error: coursesError 
  } = useQuery<AssignedCourse[]>({
    queryKey: ['professor-courses'],
    queryFn: async () => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      
      const { data: professor, error: profError } = await supabase
        .from('professors')
        .select('id')
        .eq('user_id', currentUser?.id)
        .maybeSingle();

      if (profError) {
        const msg = `Erreur lors de la recherche du profil professeur: ${profError.message}`;
        toast({
          title: "Erreur",
          description: msg,
          variant: "destructive",
        });
        throw new Error(msg);
      }

      if (!professor) {
        const msg = 'Votre compte professeur n\'a pas été correctement configuré. Veuillez contacter l\'administrateur pour créer votre profil professeur.';
        toast({
          title: "Erreur",
          description: msg,
          variant: "destructive",
        });
        throw new Error(msg);
      }

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

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours",
          variant: "destructive",
        });
        throw error;
      }

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

      return coursesWithCounts;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const loading = statsLoading || coursesLoading;
  const error = statsError?.message || coursesError?.message || null;

  return {
    stats,
    courses,
    loading,
    error,
    professorRecordExists,
    refetchStats: () => queryClient.invalidateQueries({ queryKey: ['professor-stats'] }),
    refetchCourses: () => queryClient.invalidateQueries({ queryKey: ['professor-courses'] }),
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-stats'] });
      queryClient.invalidateQueries({ queryKey: ['professor-courses'] });
    }
  };
};