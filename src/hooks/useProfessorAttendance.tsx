import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  attendance_id: string;
  student_id: string;
  student_name: string;
  attendance_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export const useProfessorAttendance = (courseId: string) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttendance = useCallback(async (startDate?: string, endDate?: string) => {
    if (!courseId) return;
    
    console.log('📅 Fetching attendance for date:', startDate, endDate);
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_course_attendance', {
        p_course_id: courseId,
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });

      if (error) throw error;
      console.log('✅ Fetched attendance records:', data?.length || 0);
      setAttendance(data || []);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les présences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, toast]);

  const fetchStats = useCallback(async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase.rpc('get_attendance_statistics', {
        p_course_id: courseId
      });

      if (error) throw error;
      setStats(data);
    } catch (error: any) {
      console.error('Error fetching attendance stats:', error);
    }
  }, [courseId]);

  const markAttendance = useCallback(async (
    studentIds: string[],
    date: string,
    status: string,
    notes?: string,
    sessionId?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('mark_attendance_bulk', {
        p_course_id: courseId,
        p_student_ids: studentIds,
        p_attendance_date: date,
        p_status: status,
        p_notes: notes || null,
        p_session_id: sessionId || null
      });

      if (error) throw error;

      const result = data as { inserted: number; total: number };
      toast({
        title: "Succès",
        description: `${result.inserted} présence(s) enregistrée(s)`,
      });

      await fetchAttendance(date, date);
      return true;
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la présence",
        variant: "destructive",
      });
      return false;
    }
  }, [courseId, toast, fetchAttendance]);

  const updateAttendance = useCallback(async (
    attendanceId: string,
    status: string,
    notes?: string
  ) => {
    try {
      const { error } = await supabase.rpc('update_attendance_record', {
        p_attendance_id: attendanceId,
        p_status: status,
        p_notes: notes || null
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Présence mise à jour",
      });

      await fetchAttendance();
      return true;
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la présence",
        variant: "destructive",
      });
      return false;
    }
  }, [courseId, toast, fetchAttendance]);

  return {
    attendance,
    stats,
    loading,
    fetchAttendance,
    fetchStats,
    markAttendance,
    updateAttendance
  };
};
