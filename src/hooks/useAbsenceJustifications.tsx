import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AbsenceJustification {
  id: string;
  attendance_id: string;
  student_id: string;
  justification_type: string;
  reason: string;
  document_url: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useAbsenceJustifications = () => {
  const [justifications, setJustifications] = useState<AbsenceJustification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchJustifications = async (studentId?: string) => {
    setLoading(true);
    try {
      let query = supabase.from('absence_justifications').select('*');
      if (studentId) query = query.eq('student_id', studentId);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setJustifications(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les justificatifs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJustification = async (justification: Omit<AbsenceJustification, 'id' | 'created_at' | 'updated_at' | 'reviewed_by' | 'reviewed_at' | 'admin_notes' | 'status'>) => {
    try {
      const { error } = await supabase.from('absence_justifications').insert(justification);
      if (error) throw error;
      toast({ title: "Succès", description: "Justificatif soumis" });
      await fetchJustifications();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le justificatif",
        variant: "destructive",
      });
      return false;
    }
  };

  const reviewJustification = async (id: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('absence_justifications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Succès", description: `Justificatif ${status === 'approved' ? 'approuvé' : 'rejeté'}` });
      await fetchJustifications();
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter le justificatif",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    justifications,
    loading,
    fetchJustifications,
    createJustification,
    reviewJustification
  };
};
