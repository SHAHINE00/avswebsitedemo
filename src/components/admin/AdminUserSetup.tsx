import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';

const AdminUserSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingAdmins, setExistingAdmins] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, role, created_at')
        .eq('role', 'admin');

      if (error) throw error;
      setExistingAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
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
        .select('id, email, role')
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

      if (userData.role === 'admin') {
        toast({
          title: 'Information',
          description: 'Cet utilisateur est déjà administrateur',
        });
        return;
      }

      // Update user role to admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', email.trim());

      if (updateError) throw updateError;

      toast({
        title: 'Succès',
        description: 'Utilisateur promu administrateur avec succès',
      });

      setEmail('');
      fetchAdmins();
    } catch (error) {
      console.error('Error promoting user:', error);
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
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('email', userEmail);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Droits d\'administrateur révoqués',
      });

      fetchAdmins();
    } catch (error) {
      console.error('Error revoking admin:', error);
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