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
      const { data, error } = await supabase.rpc('get_student_detail', {
        p_student_id: studentId,
        p_course_id: courseId
      });

      if (error) throw error;
      return data as unknown as StudentDetail;
    } catch (error: any) {
      console.error('Error fetching student detail:', error);
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
