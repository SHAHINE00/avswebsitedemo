import React from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';
import { logError } from '@/utils/logger';

const AdminUserSetup: React.FC = () => {
  const [email, setEmail] = useSafeState('');
  const [loading, setLoading] = useSafeState(false);
  const [existingAdmins, setExistingAdmins] = useSafeState<any[]>([]);
  const { toast } = useToast();

  useSafeEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      const adminUserIds = adminRoles?.map(r => r.user_id) || [];
      
      if (adminUserIds.length === 0) {
        setExistingAdmins([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .in('id', adminUserIds);

      if (profilesError) throw profilesError;
      
      setExistingAdmins(profiles || []);
    } catch (error) {
      logError('Error fetching admins:', error);
    }
  };

  const promoteToAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // First, check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.trim())
        .single();

      if (userError) {
        toast({
          title: 'Erreur',
          description: 'Utilisateur non trouvé. L\'utilisateur doit d\'abord s\'inscrire.',
          variant: 'destructive',
        });
        return;
      }

      // Check if already admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.id)
        .eq('role', 'admin')
        .single();

      if (existingRole) {
        toast({
          title: 'Information',
          description: 'Cet utilisateur est déjà administrateur',
        });
        return;
      }

      // Promote user to admin using RPC function
      const { error: promoteError } = await supabase.rpc('promote_user_to_admin', {
        p_target_user_id: userData.id
      });

      if (promoteError) throw promoteError;

      toast({
        title: 'Succès',
        description: 'Utilisateur promu administrateur avec succès',
      });

      setEmail('');
      fetchAdmins();
    } catch (error) {
      logError('Error promoting user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de promouvoir l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const revokeAdmin = async (userEmail: string) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer les droits d\'administrateur ?')) return;

    try {
      // Get user ID from email
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (!userData) {
        throw new Error('User not found');
      }

      // Demote user using RPC function
      const { error } = await supabase.rpc('demote_user_to_user', {
        p_target_user_id: userData.id
      });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Droits d\'administrateur révoqués',
      });

      fetchAdmins();
    } catch (error) {
      logError('Error revoking admin:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de révoquer les droits',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion des Administrateurs
          </CardTitle>
          <CardDescription>
            Promouvoir des utilisateurs au rôle d'administrateur pour gérer les cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription>
              L'utilisateur doit d'abord créer un compte sur la plateforme avant de pouvoir être promu administrateur.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="admin-email">Email de l'utilisateur</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="utilisateur@example.com"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={promoteToAdmin} disabled={loading}>
                {loading ? 'Promotion...' : 'Promouvoir Admin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {existingAdmins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Administrateurs Actuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingAdmins.map((admin) => (
                <div key={admin.email} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{admin.email}</p>
                    {admin.full_name && (
                      <p className="text-sm text-gray-600">{admin.full_name}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Admin depuis: {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeAdmin(admin.email)}
                  >
                    Révoquer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUserSetup;