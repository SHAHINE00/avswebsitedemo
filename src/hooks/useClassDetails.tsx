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
      // Fetch class info first to get course_id, then students with attendance and grades
      let courseId: string | undefined;
      // Get course_id safely (avoid .single() errors when no row)
      const { data: classData, error: classError } = await supabase
        .from('course_classes')
        .select('course_id')
        .eq('id', id)
        .maybeSingle();
      if (classError) throw classError;
      courseId = classData?.course_id;

      let studentsData: any[] = [];
      let studentsError: any = null;

      try {
        // Fetch enrollments (no cross-table join to avoid FK/relationship errors)
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select('user_id, enrolled_at')
          .eq('class_id', id);

        if (enrollmentsError) {
          studentsError = enrollmentsError;
          throw enrollmentsError;
        }

        const studentIds = enrollments?.map((e: any) => e.user_id) || [];

        let profilesData: any[] = [];
        let attendanceRows: any[] = [];
        let gradeRows: any[] = [];

        if (studentIds.length > 0) {
          const [profilesRes, attendanceRes, gradesRes] = await Promise.all([
            supabase.from('profiles').select('id, full_name, email').in('id', studentIds),
            supabase.from('attendance').select('student_id, status').in('student_id', studentIds),
            supabase.from('grades').select('student_id, grade, max_grade').in('student_id', studentIds),
          ]);

          // Handle results (attendanceRes/gradesRes are objects with data and error)
          if (profilesRes.error) throw profilesRes.error;
          profilesData = profilesRes.data || [];

          if (attendanceRes && 'error' in attendanceRes && attendanceRes.error) throw attendanceRes.error;
          attendanceRows = (attendanceRes && 'data' in attendanceRes ? attendanceRes.data : []) || [];

          if (gradesRes.error) throw gradesRes.error;
          gradeRows = gradesRes.data || [];
        }

        const profileMap = new Map<string, any>(profilesData.map((p: any) => [p.id, p]));

        studentsData = (enrollments || []).map((enrollment: any) => {
          const profile = profileMap.get(enrollment.user_id);

          const studentAttendance = attendanceRows.filter((a: any) => a.student_id === enrollment.user_id);
          const totalAttendance = studentAttendance.length;
          const presentCount = studentAttendance.filter((a: any) => a.status === 'present').length;
          const absentCount = studentAttendance.filter((a: any) => a.status === 'absent').length;

          const studentGrades = gradeRows.filter((g: any) => g.student_id === enrollment.user_id);
          const averageGrade = studentGrades.length > 0
            ? studentGrades.reduce((sum: number, g: any) => sum + (g.grade / g.max_grade * 100), 0) / studentGrades.length
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
            enrollment_date: enrollment.enrolled_at,
          } as ClassStudent;
        });
      } catch (err: any) {
        studentsError = err;
      }

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch class sessions using previously loaded courseId
      if (courseId) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('class_sessions')
          .select('*')
          .eq('course_id', courseId)
          .order('session_date', { ascending: false })
          .limit(20);

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
      } else {
        setSessions([]);
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
