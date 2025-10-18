import { useState, useEffect } from 'react';
import { logError } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  roles: string[] | null;
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
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for all users
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: rolesData?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      })) || [];

      setUsers(usersWithRoles);
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

  const updateUserRole = async (userId: string, newRole: string, currentRoles: string[] | null) => {
    try {
      const isCurrentlyAdmin = currentRoles?.includes('admin') || false;
      
      if (newRole === 'admin' && !isCurrentlyAdmin) {
        const { error } = await supabase.rpc('promote_user_to_admin', {
          p_target_user_id: userId
        });
        if (error) throw error;
      } else if (newRole !== 'admin' && isCurrentlyAdmin) {
        const { error } = await supabase.rpc('demote_user_to_user', {
          p_target_user_id: userId
        });
        if (error) throw error;
      }

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
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId, userEmail }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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
      const { data, error } = await supabase.functions.invoke('admin-invite-user', {
        body: { email: email.trim(), message }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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

  const generateResetLink = async (userId: string, userEmail: string): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erreur",
          description: "Session expirée",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase.functions.invoke('admin-generate-reset-link', {
        body: { userId, userEmail }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (!data?.resetLink) {
        throw new Error('No reset link returned');
      }

      toast({
        title: "Succès",
        description: "Lien de réinitialisation généré",
      });

      return data.resetLink;
    } catch (error) {
      logError('Error generating reset link:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de réinitialisation",
        variant: "destructive",
      });
      return null;
    }
  };

  const resetUserPassword = async (userEmail: string) => {
    if (!confirm(`Envoyer un email de réinitialisation de mot de passe à ${userEmail} ?`)) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
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
    resetUserPassword,
    generateResetLink
  };
};