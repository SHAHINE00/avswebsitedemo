import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClassStudent {
  id: string;
  full_name: string;
  email: string;
  total_attendance: number;
  present_count: number;
  absent_count: number;
  attendance_rate: number;
  average_grade: number | null;
  enrollment_date: string;
}

export interface ClassSessionInfo {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room_location?: string;
  session_type?: string;
  status: string;
  notes?: string;
  attendance_marked: boolean;
}

export const useClassDetails = (classId?: string) => {
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [sessions, setSessions] = useState<ClassSessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchClassDetails = async (id?: string) => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch students with attendance and grades
      let studentsData: any[] = [];
      let studentsError: any = null;

      try {
        // Fallback implementation (RPC function may not exist yet)
        const { data: enrollments, error } = await supabase
          .from('course_enrollments')
          .select(`
            user_id,
            enrolled_at,
            profiles:user_id (
              id,
              full_name,
              email
            )
          `)
          .eq('class_id', id);

        if (error) {
          studentsError = error;
          throw error;
        }

        // Get attendance and grades separately
        const studentIds = enrollments?.map(e => e.user_id) || [];
        
        const [attendanceData, gradesData] = await Promise.all([
          supabase
            .from('attendance')
            .select('student_id, status')
            .in('student_id', studentIds),
          supabase
            .from('grades')
            .select('student_id, grade, max_grade')
            .in('student_id', studentIds)
        ]);

        studentsData = enrollments?.map(enrollment => {
            const profile = Array.isArray(enrollment.profiles) 
              ? enrollment.profiles[0] 
              : enrollment.profiles;
            
            const studentAttendance = attendanceData.data?.filter(
              a => a.student_id === enrollment.user_id
            ) || [];
            const totalAttendance = studentAttendance.length;
            const presentCount = studentAttendance.filter(a => a.status === 'present').length;
            const absentCount = studentAttendance.filter(a => a.status === 'absent').length;

            const studentGrades = gradesData.data?.filter(
              g => g.student_id === enrollment.user_id
            ) || [];
            const averageGrade = studentGrades.length > 0
              ? studentGrades.reduce((sum, g) => sum + (g.grade / g.max_grade * 100), 0) / studentGrades.length
              : null;

            return {
              id: enrollment.user_id,
              full_name: profile?.full_name || profile?.email || 'Unknown',
              email: profile?.email || '',
              total_attendance: totalAttendance,
              present_count: presentCount,
              absent_count: absentCount,
              attendance_rate: totalAttendance > 0 ? (presentCount / totalAttendance * 100) : 0,
              average_grade: averageGrade,
              enrollment_date: enrollment.enrolled_at
            };
          }) || [];
      } catch (err: any) {
        studentsError = err;
      }

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch class sessions
      const { data: classData } = await supabase
        .from('course_classes')
        .select('course_id')
        .eq('id', id)
        .single();

      if (classData) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('class_sessions')
          .select('*')
          .eq('course_id', classData.course_id)
          .order('session_date', { ascending: false })
          .limit(20);

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
      }

    } catch (error: any) {
      console.error('Error fetching class details:', error);
      // Only show error for real errors, not empty data
      if (error?.code !== 'PGRST116') {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la classe",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassDetails(classId);
    }
  }, [classId]);

  return {
    students,
    sessions,
    loading,
    refetch: () => fetchClassDetails(classId),
  };
};
