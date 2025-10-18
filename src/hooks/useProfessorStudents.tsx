import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseStudent {
  student_id: string;
  full_name: string;
  email: string;
  enrolled_at: string;
  progress_percentage: number;
  status: string;
  total_attendance: number;
  present_count: number;
  absent_count: number;
  average_grade: number | null;
}

export interface StudentDetail {
  profile: any;
  enrollment: any;
  attendance_records: any[];
  grades: any[];
  statistics: {
    total_attendance: number;
    present_count: number;
    absent_count: number;
    attendance_rate: number;
    average_grade: number;
    total_grades: number;
  };
}

export const useProfessorStudents = (courseId: string) => {
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchStudents = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_course_students', {
        p_course_id: courseId
      });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étudiants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetail = async (studentId: string): Promise<StudentDetail | null> => {
    try {
      console.log('🔍 Fetching student detail for:', studentId, 'in course:', courseId);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .maybeSingle();

      console.log('📋 Profile data:', profile, 'Error:', profileError);
      if (profileError) throw profileError;

      // Fetch enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .maybeSingle();

      console.log('📝 Enrollment data:', enrollment, 'Error:', enrollmentError);
      if (enrollmentError) throw enrollmentError;

      // Fetch attendance records
      const { data: attendance_records, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .order('attendance_date', { ascending: false });

      console.log('📊 Attendance records:', attendance_records?.length, 'Error:', attendanceError);
      if (attendanceError) throw attendanceError;

      // Fetch grades
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId)
        .order('graded_at', { ascending: false });

      console.log('🎓 Grades:', grades?.length, 'Error:', gradesError);
      if (gradesError) throw gradesError;

      // Calculate statistics
      const total_attendance = attendance_records?.length || 0;
      const present_count = attendance_records?.filter(a => a.status === 'present').length || 0;
      const absent_count = attendance_records?.filter(a => a.status === 'absent').length || 0;
      const attendance_rate = total_attendance > 0 ? Math.round((present_count / total_attendance) * 100) : 0;
      const average_grade = grades && grades.length > 0
        ? Math.round(grades.reduce((sum, g) => sum + Number(g.grade), 0) / grades.length * 100) / 100
        : 0;

      const result = {
        profile,
        enrollment,
        attendance_records: attendance_records || [],
        grades: grades || [],
        statistics: {
          total_attendance,
          present_count,
          absent_count,
          attendance_rate,
          average_grade,
          total_grades: grades?.length || 0,
        }
      };
      
      console.log('✅ Student detail result:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error fetching student detail:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de l'étudiant",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    students,
    loading,
    fetchStudents,
    fetchStudentDetail
  };
};
