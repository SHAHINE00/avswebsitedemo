import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_programme_title?: string;
  formation_tag?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  metadata?: any;
}

export const usePendingUsers = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchPendingUsers = async () => {
    if (!user || !isAdmin) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pending_users')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      setPendingUsers(data || []);
    } catch (error) {
      logError('Error fetching pending users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes en attente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approvePendingUser = async (pendingUserId: string) => {
    if (!user || !isAdmin) return;

    try {
      setApproving(pendingUserId);
      
      const { data, error } = await supabase.functions.invoke('approve-pending-user', {
        body: { 
          pending_user_id: pendingUserId, 
          action: 'approve' 
        }
      });

      if (error) throw error;

      toast({
        title: "Utilisateur approuvé",
        description: "L'utilisateur a été approuvé et peut maintenant se connecter",
      });

      // Refresh the list
      await fetchPendingUsers();
      
    } catch (error: any) {
      logError('Error approving user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setApproving(null);
    }
  };

  const rejectPendingUser = async (pendingUserId: string, rejectionReason?: string) => {
    if (!user || !isAdmin) return;

    try {
      setApproving(pendingUserId);
      
      const { data, error } = await supabase.functions.invoke('approve-pending-user', {
        body: { 
          pending_user_id: pendingUserId, 
          action: 'reject',
          rejection_reason: rejectionReason
        }
      });

      if (error) throw error;

      toast({
        title: "Utilisateur rejeté",
        description: "L'utilisateur a été informé de la décision",
      });

      // Refresh the list
      await fetchPendingUsers();
      
    } catch (error: any) {
      logError('Error rejecting user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setApproving(null);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchPendingUsers();
    }
  }, [user, isAdmin]);

  return {
    pendingUsers,
    loading,
    approving,
    fetchPendingUsers,
    approvePendingUser,
    rejectPendingUser
  };
};