import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClassStats {
  totalStudents: number;
  attendanceRate: number;
  averageGrade: number;
  activeSessions: number;
  upcomingSessions: number;
  atRiskStudents: number;
  roomLocation?: string;
}

export const useClassStats = (classId?: string) => {
  const [stats, setStats] = useState<ClassStats>({
    totalStudents: 0,
    attendanceRate: 0,
    averageGrade: 0,
    activeSessions: 0,
    upcomingSessions: 0,
    atRiskStudents: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async (id?: string) => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Get class and course info
      const { data: classData } = await supabase
        .from('course_classes')
        .select('course_id, current_students')
        .eq('id', id)
        .single();

      if (!classData) {
        setLoading(false);
        return;
      }

      // Get students count
      const { count: studentCount } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', id);

      // Get student IDs for filtering
      const { data: enrolledStudents } = await supabase
        .from('course_enrollments')
        .select('user_id')
        .eq('class_id', id);

      const studentIds = enrolledStudents?.map(e => e.user_id) || [];

      // Get attendance stats
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status')
        .eq('course_id', classData.course_id)
        .in('student_id', studentIds);

      const totalAttendance = attendanceData?.length || 0;
      const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance * 100) : 0;

      // Get grade stats
      const { data: gradesData } = await supabase
        .from('grades')
        .select('grade, max_grade')
        .eq('course_id', classData.course_id)
        .in('student_id', studentIds);

      const averageGrade = gradesData && gradesData.length > 0
        ? gradesData.reduce((sum, g) => sum + (g.grade / g.max_grade * 100), 0) / gradesData.length
        : 0;

      // Get session stats
      const { data: sessionsData } = await supabase
        .from('class_sessions')
        .select('session_date, status')
        .eq('course_id', classData.course_id);

      const today = new Date().toISOString().split('T')[0];
      const activeSessions = sessionsData?.filter(s => s.status === 'completed').length || 0;
      const upcomingSessions = sessionsData?.filter(s => s.session_date > today).length || 0;

      // Get room location from schedule
      const { data: scheduleData } = await supabase
        .from('class_schedules')
        .select('room_location')
        .eq('course_id', classData.course_id)
        .limit(1)
        .maybeSingle();

      // Calculate at-risk students (attendance < 70% or grade < 60%)
      const atRiskStudents = 0; // Simplified for now

      setStats({
        totalStudents: studentCount || classData.current_students || 0,
        attendanceRate: Math.round(attendanceRate),
        averageGrade: Math.round(averageGrade),
        activeSessions,
        upcomingSessions,
        atRiskStudents,
        roomLocation: scheduleData?.room_location,
      });

    } catch (error) {
      console.error('Error fetching class stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchStats(classId);
    }
  }, [classId]);

  return {
    stats,
    loading,
    refetch: () => fetchStats(classId),
  };
};
