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
        .select('id, email, full_name, phone, role, created_at, updated_at')
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
      if (newRole === 'admin') {
        const { error } = await supabase.rpc('promote_user_to_admin', {
          p_target_user_id: userId
        });
        if (error) throw error;
      } else {
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

  const resetUserPassword = async (userEmail: string) => {
    const email = (userEmail || '').trim();
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez fournir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Envoyer un email de réinitialisation de mot de passe à ${email} ?`)) return;

    try {
      const key = `pw_reset_cooldown:${email.toLowerCase()}`;
      const now = Date.now();
      const until = Number(localStorage.getItem(key) || 0);
      const remaining = Math.max(0, Math.ceil((until - now) / 1000));
      if (remaining > 0) {
        toast({
          title: "Veuillez patienter",
          description: `Vous pourrez renvoyer un email dans ${remaining}s.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        const msg = (error as any)?.message || '';
        const codeText = msg.toLowerCase();

        // Start 60s cooldown on rate limit - try SMTP fallback
        if (codeText.includes('rate') || codeText.includes('429') || codeText.includes('over_email_send_rate_limit')) {
          localStorage.setItem(key, String(now + 60_000));

          // Attempt fallback via Edge Function using Hostinger SMTP
          try {
            const { data: fnData, error: fnError } = await supabase.functions.invoke('send-password-reset-link', {
              body: { email, redirectTo: `${window.location.origin}/reset-password` }
            });

            if (fnError || (fnData as any)?.error) {
              toast({
                title: "Limite de débit atteinte",
                description: "Attendez 60s avant de renvoyer l'email de réinitialisation.",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Email envoyé (mode secours)",
              description: "Lien de réinitialisation envoyé via SMTP.",
            });
            return;
          } catch (e) {
            toast({
              title: "Limite de débit atteinte",
              description: "Attendez 60s avant de renvoyer l'email de réinitialisation.",
              variant: "destructive",
            });
            return;
          }
        }

        if (codeText.includes('invalid') || codeText.includes('not found')) {
          toast({
            title: "Email introuvable",
            description: "Aucun utilisateur associé à cet email.",
            variant: "destructive",
          });
          return;
        }

        if (codeText.includes('timeout') || (error as any)?.status === 504) {
          toast({
            title: "Temps dépassé",
            description: "Le serveur a mis trop de temps à répondre. Réessayez dans un instant.",
            variant: "destructive",
          });
          return;
        }

        throw error;
      }

      // Success: set a short cooldown to avoid rapid repeats
      localStorage.setItem(`pw_reset_cooldown:${email.toLowerCase()}`, String(Date.now() + 60_000));

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