
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar,
  TrendingUp,
  Shield,
  User,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Filter,
  Download,
  UserPlus,
  Key,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminUserSetup from '@/components/admin/AdminUserSetup';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ComprehensiveUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const { toast } = useToast();
  const { logActivity } = useAdminActivityLogs();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, dateFilter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all' && user.created_at) {
        const userDate = new Date(user.created_at);
        const now = new Date();
        switch (dateFilter) {
          case 'today':
            matchesDate = userDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = userDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesRole && matchesDate;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'full_name':
          return (a.full_name || '').localeCompare(b.full_name || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'created_at':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredUsers(filtered);
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
      console.error('Error updating user role:', error);
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
      console.error('Error deleting user:', error);
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
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const inviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        redirectTo: `${window.location.origin}/auth`,
        data: { message: inviteMessage }
      });

      if (error) throw error;

      await logActivity('user_invited', 'user', null, { email: inviteEmail, message: inviteMessage });

      toast({
        title: "Succès",
        description: "Invitation envoyée avec succès",
      });

      setInviteEmail('');
      setInviteMessage('');
      setShowInviteDialog(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive",
      });
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
      console.error('Error resetting password:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    const confirmMessage = {
      'promote': `Promouvoir ${selectedUsers.length} utilisateur(s) au rang d'administrateur ?`,
      'demote': `Rétrograder ${selectedUsers.length} administrateur(s) au rang d'utilisateur ?`,
      'delete': `Supprimer ${selectedUsers.length} utilisateur(s) ? Cette action est irréversible.`
    }[action];

    if (!confirm(confirmMessage)) return;

    try {
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        if (!user) continue;

        switch (action) {
          case 'promote':
            if (user.role !== 'admin') {
              await updateUserRole(userId, 'admin', user.role);
            }
            break;
          case 'demote':
            if (user.role === 'admin') {
              await updateUserRole(userId, 'user', user.role);
            }
            break;
          case 'delete':
            await deleteUser(userId, user.email || '');
            break;
        }
      }

      setSelectedUsers([]);
      toast({
        title: "Succès",
        description: `Action effectuée sur ${selectedUsers.length} utilisateur(s)`,
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'action groupée",
        variant: "destructive",
      });
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role !== 'admin').length;
    const recentUsers = users.filter(user => {
      if (!user.created_at) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(user.created_at) >= weekAgo;
    }).length;

    return { totalUsers, admins, regularUsers, recentUsers };
  };

  const getUserInitials = (user: UserProfile) => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement des utilisateurs...</div>;
  }

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Tous les utilisateurs inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              Équipe d'administration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Standard</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regularUsers}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs normaux
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux (7j)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUsers}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="management">Gestion Utilisateurs</TabsTrigger>
          <TabsTrigger value="admin-setup">Configuration Admin</TabsTrigger>
          <TabsTrigger value="bulk-actions">Actions Groupées</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>Recherche, filtrage et gestion des rôles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Inviter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Inviter un utilisateur</DialogTitle>
                        <DialogDescription>
                          Envoyer une invitation par email pour rejoindre la plateforme
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invite-email">Email</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="utilisateur@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="invite-message">Message personnalisé (optionnel)</Label>
                          <Textarea
                            id="invite-message"
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                            placeholder="Message d'accueil..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                          Annuler
                        </Button>
                        <Button onClick={inviteUser}>
                          Envoyer l'invitation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={fetchUsers}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 mb-6">
                {/* Enhanced Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher par email ou nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="user">Utilisateurs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date d'inscription</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="full_name">Nom</SelectItem>
                      <SelectItem value="role">Rôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedUsers.length} utilisateur(s) sélectionné(s)
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Désélectionner
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('promote')}>
                        Promouvoir
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('demote')}>
                        Rétrograder
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User List with Enhanced Actions */}
              <div className="space-y-4">
                {/* Select All Option */}
                {filteredUsers.length > 0 && (
                  <div className="flex items-center space-x-2 p-2 border-b">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllUsers();
                        } else {
                          clearSelection();
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">
                      Sélectionner tous ({filteredUsers.length})
                    </Label>
                  </div>
                )}

                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    
                    <Avatar>
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {user.full_name || 'Nom non renseigné'}
                        </h3>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.created_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Inscrit {formatDistanceToNow(new Date(user.created_at), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetUserPassword(user.email || '')}
                      >
                        <Key className="w-4 h-4" />
                      </Button>

                      {user.role === 'admin' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserRole(user.id, 'user', user.role)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Rétrograder
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserRole(user.id, 'admin', user.role)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Promouvoir
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id, user.email || '')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun utilisateur trouvé avec les filtres actuels</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-setup">
          <AdminUserSetup />
        </TabsContent>

        <TabsContent value="bulk-actions">
          <Card>
            <CardHeader>
              <CardTitle>Actions Groupées</CardTitle>
              <CardDescription>
                Effectuer des actions sur plusieurs utilisateurs à la fois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    Sélectionnez des utilisateurs dans l'onglet "Gestion Utilisateurs" pour utiliser les actions groupées.
                  </AlertDescription>
                </Alert>
                
                {selectedUsers.length > 0 && (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        {selectedUsers.length} utilisateur(s) sélectionné(s)
                      </h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleBulkAction('promote')}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Promouvoir en Admin
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleBulkAction('demote')}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Rétrograder en User
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleBulkAction('delete')}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
              <DialogDescription>
                Modifier les informations de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-full-name">Nom complet</Label>
                <Input
                  id="edit-full-name"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Rôle</Label>
                <Select 
                  value={editingUser.role || 'user'} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Annuler
              </Button>
              <Button onClick={() => updateUserProfile(editingUser.id, {
                email: editingUser.email,
                full_name: editingUser.full_name,
                role: editingUser.role
              })}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ComprehensiveUserManagement;
