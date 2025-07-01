
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminUserSetup from '@/components/admin/AdminUserSetup';
import { UserStats } from './user-management/UserStats';
import { UserFilters } from './user-management/UserFilters';
import { BulkActionsBar } from './user-management/BulkActionsBar';
import { UserCard } from './user-management/UserCard';
import { UserInviteDialog } from './user-management/UserInviteDialog';
import { UserEditDialog } from './user-management/UserEditDialog';
import { BulkActionsTab } from './user-management/BulkActionsTab';
import { useUserManagement } from './user-management/hooks/useUserManagement';
import { useUserFilters } from './user-management/hooks/useUserFilters';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ComprehensiveUserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const { toast } = useToast();

  const {
    users,
    loading,
    fetchUsers,
    updateUserRole,
    deleteUser,
    updateUserProfile,
    inviteUser,
    resetUserPassword
  } = useUserManagement();

  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter
  } = useUserFilters(users);

  const handleInviteUser = async () => {
    const success = await inviteUser(inviteEmail, inviteMessage);
    if (success) {
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteDialog(false);
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


  if (loading) {
    return <div className="flex items-center justify-center p-8">Chargement des utilisateurs...</div>;
  }

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <UserStats {...stats} />

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
                  <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Inviter
                  </Button>
                  <Button variant="outline" size="sm" onClick={fetchUsers}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 mb-6">
                <UserFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  roleFilter={roleFilter}
                  setRoleFilter={setRoleFilter}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                <BulkActionsBar
                  selectedCount={selectedUsers.length}
                  onClearSelection={clearSelection}
                  onBulkAction={handleBulkAction}
                />
              </div>

              <div className="space-y-4">
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
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    onToggleSelection={() => toggleUserSelection(user.id)}
                    onEdit={() => setEditingUser(user)}
                    onResetPassword={() => resetUserPassword(user.email || '')}
                    onUpdateRole={(newRole) => updateUserRole(user.id, newRole, user.role)}
                    onDelete={() => deleteUser(user.id, user.email || '')}
                  />
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
          <BulkActionsTab
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
          />
        </TabsContent>
      </Tabs>

      <UserInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteMessage={inviteMessage}
        setInviteMessage={setInviteMessage}
        onInvite={handleInviteUser}
      />

      <UserEditDialog
        user={editingUser}
        onUserChange={setEditingUser}
        onSave={() => updateUserProfile(editingUser!.id, {
          email: editingUser!.email,
          full_name: editingUser!.full_name,
          role: editingUser!.role
        })}
        onCancel={() => setEditingUser(null)}
      />
    </div>
  );
};

export default ComprehensiveUserManagement;
