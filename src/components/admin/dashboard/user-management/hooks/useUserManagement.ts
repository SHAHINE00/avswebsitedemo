import { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { logActivity } = useAdminActivityLogs();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      logError('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string, currentRole: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      await logActivity(
        newRole === 'admin' ? 'user_promoted' : 'user_demoted',
        'user',
        userId,
        { old_role: currentRole, new_role: newRole }
      );

      toast({
        title: "Succès",
        description: `Utilisateur ${newRole === 'admin' ? 'promu' : 'rétrogradé'} avec succès`,
      });

      fetchUsers();
    } catch (error) {
      logError('Error updating user role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ? Cette action est irréversible.`)) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await logActivity('user_deleted', 'user', userId, { email: userEmail });

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      fetchUsers();
    } catch (error) {
      logError('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      await logActivity('user_updated', 'user', userId, updates);

      toast({
        title: "Succès",
        description: "Profil utilisateur mis à jour",
      });

      fetchUsers();
    } catch (error) {
      logError('Error updating user profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const inviteUser = async (email: string, message: string) => {
    if (!email.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
        data: { message }
      });

      if (error) throw error;

      await logActivity('user_invited', 'user', null, { email, message });

      toast({
        title: "Succès",
        description: "Invitation envoyée avec succès",
      });

      return true;
    } catch (error) {
      logError('Error inviting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetUserPassword = async (userEmail: string) => {
    if (!confirm(`Envoyer un email de réinitialisation de mot de passe à ${userEmail} ?`)) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail);
      if (error) throw error;

      toast({
        title: "Succès",
        description: "Email de réinitialisation envoyé",
      });
    } catch (error) {
      logError('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    updateUserRole,
    deleteUser,
    updateUserProfile,
    inviteUser,
    resetUserPassword
  };
};