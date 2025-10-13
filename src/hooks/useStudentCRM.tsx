import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimelineEvent {
  event_id: string;
  event_type: string;
  event_date: string;
  title: string;
  description: string;
  metadata: any;
}

interface StudentSegment {
  segment_name: string;
  segment_count: number;
  student_ids: string[];
}

export const useStudentCRM = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStudentTimeline = async (userId: string, limit = 50): Promise<TimelineEvent[]> => {
    try {
      const { data, error } = await supabase.rpc('get_student_timeline', {
        p_user_id: userId,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching timeline:', error);
      return [];
    }
  };

  const getStudentSegments = async (): Promise<StudentSegment[]> => {
    try {
      const { data, error } = await supabase.rpc('get_student_segments');
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching segments:', error);
      return [];
    }
  };

  const addStudentNote = async (userId: string, noteText: string, noteType: string = 'general') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .insert({
          user_id: userId,
          note_text: noteText,
          note_type: noteType,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note ajoutée"
      });

      return data;
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de la note",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logCommunication = async (
    userId: string,
    communicationType: string,
    message: string,
    subject?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('communication_log')
        .insert({
          user_id: userId,
          communication_type: communicationType,
          subject: subject,
          message: message,
          direction: 'outbound',
          sent_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error logging communication:', error);
      return null;
    }
  };

  const getStudentNotes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      return [];
    }
  };

  const getCommunicationHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('communication_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching communication history:', error);
      return [];
    }
  };

  const getStudentAnalytics = async (startDate?: string, endDate?: string) => {
    try {
      const { data, error } = await supabase.rpc('get_student_analytics', {
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      return data || {};
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      return {};
    }
  };

  const bulkEnrollStudents = async (userIds: string[], courseId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('bulk_enroll_users', {
        p_user_ids: userIds,
        p_course_id: courseId
      });

      if (error) throw error;

      const result = data as any;

      toast({
        title: "Succès",
        description: `${result?.success_count || 0} étudiant(s) inscrit(s)`
      });

      return data;
    } catch (error: any) {
      console.error('Error bulk enrolling:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStudentTags = async (userId: string, tagName: string, tagColor: string) => {
    try {
      const { data, error } = await supabase
        .from('student_tags')
        .insert({
          user_id: userId,
          tag_name: tagName,
          tag_color: tagColor,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tag ajouté"
      });

      return data;
    } catch (error: any) {
      console.error('Error adding tag:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const exportStudents = async (studentIds: string[], columns: string[]) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(columns.join(','))
        .in('id', studentIds);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error exporting students:', error);
      return [];
    }
  };

  return {
    loading,
    getStudentTimeline,
    getStudentSegments,
    addStudentNote,
    logCommunication,
    getStudentNotes,
    getCommunicationHistory,
    getStudentAnalytics,
    bulkEnrollStudents,
    updateStudentTags,
    exportStudents
  };
};
