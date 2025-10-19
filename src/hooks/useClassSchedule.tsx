import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClassSchedule {
  id: string;
  course_id: string;
  professor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_location: string | null;
  session_type: string;
  is_recurring: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useClassSchedule = (courseId?: string) => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      let query = supabase.from('class_schedules').select('*');
      if (courseId) query = query.eq('course_id', courseId);
      
      const { data, error } = await query.order('day_of_week').order('start_time');
      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les emplois du temps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (schedule: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('class_schedules').insert(schedule);
      if (error) {
        console.error('Error creating schedule:', error);
        throw error;
      }
      toast({ title: "Succès", description: "Emploi du temps créé" });
      await fetchSchedules();
      return true;
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'emploi du temps",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<ClassSchedule>) => {
    try {
      const { error } = await supabase.from('class_schedules').update(updates).eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Emploi du temps mis à jour" });
      await fetchSchedules();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'emploi du temps",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase.from('class_schedules').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Emploi du temps supprimé" });
      await fetchSchedules();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'emploi du temps",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateSessions = async (scheduleId: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase.rpc('generate_sessions_from_schedule', {
        p_schedule_id: scheduleId,
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      const result = data as { sessions_created?: number } | null;
      toast({ title: "Succès", description: `${result?.sessions_created || 0} séances générées` });
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les séances",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    schedules,
    loading,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    generateSessions
  };
};
