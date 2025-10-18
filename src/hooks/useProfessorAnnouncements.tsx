import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Announcement {
  id: string;
  course_id: string;
  professor_id: string;
  title: string;
  content: string;
  priority: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessorAnnouncements = (courseId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_announcements')
        .select('*')
        .eq('course_id', courseId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (
    title: string,
    content: string,
    priority: string = 'normal',
    isPinned: boolean = false
  ) => {
    try {
      const { error } = await supabase.rpc('create_course_announcement', {
        p_course_id: courseId,
        p_title: title,
        p_content: content,
        p_priority: priority,
        p_is_pinned: isPinned
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Annonce créée",
      });

      await fetchAnnouncements();
      return true;
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'annonce",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAnnouncement = async (
    announcementId: string,
    title?: string,
    content?: string,
    priority?: string,
    isPinned?: boolean
  ) => {
    try {
      const { error } = await supabase.rpc('update_course_announcement', {
        p_announcement_id: announcementId,
        p_title: title || null,
        p_content: content || null,
        p_priority: priority || null,
        p_is_pinned: isPinned !== undefined ? isPinned : null
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Annonce mise à jour",
      });

      await fetchAnnouncements();
      return true;
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'annonce",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      const { error } = await supabase.rpc('delete_course_announcement', {
        p_announcement_id: announcementId
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Annonce supprimée",
      });

      await fetchAnnouncements();
      return true;
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
};
