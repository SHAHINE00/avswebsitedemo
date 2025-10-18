import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClassSession {
  id: string;
  schedule_id: string | null;
  course_id: string;
  professor_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room_location: string | null;
  session_type: string;
  status: string;
  attendance_marked: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useClassSessions = (courseId?: string) => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSessions = async (startDate?: string, endDate?: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      let query = supabase.from('class_sessions').select('*').eq('course_id', courseId);
      if (startDate) query = query.gte('session_date', startDate);
      if (endDate) query = query.lte('session_date', endDate);
      
      const { data, error } = await query.order('session_date').order('start_time');
      if (error) throw error;
      setSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les séances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<ClassSession, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('class_sessions').insert(session);
      if (error) throw error;
      toast({ title: "Succès", description: "Séance créée" });
      await fetchSessions();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSession = async (id: string, updates: Partial<ClassSession>) => {
    try {
      const { error } = await supabase.from('class_sessions').update(updates).eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Séance mise à jour" });
      await fetchSessions();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la séance",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase.from('class_sessions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Succès", description: "Séance supprimée" });
      await fetchSessions();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la séance",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sessions,
    loading,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession
  };
};
