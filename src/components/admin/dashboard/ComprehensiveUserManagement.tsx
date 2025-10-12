import React, { useState } from 'react';
import { logError } from '@/utils/logger';
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
import { UserEnrollmentDialog } from './user-management/UserEnrollmentDialog';
import { BulkActionsTab } from './user-management/BulkActionsTab';
import { useUserManagement, type UserProfile } from './user-management/hooks/useUserManagement';
import { useUserFilters } from './user-management/hooks/useUserFilters';

const ComprehensiveUserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [enrollmentUser, setEnrollmentUser] = useState<UserProfile | null>(null);
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
    setSortBy
  } = useUserFilters(users);

  const handleInviteUser = async () => {
    const success = await inviteUser(inviteEmail, inviteMessage);
    if (success) {
      setShowInviteDialog(false);
      setInviteEmail('');
      setInviteMessage('');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = async (action: 'promote' | 'demote' | 'delete') => {
    try {
      const promises = selectedUsers.map(async (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        switch (action) {
          case 'promote':
            const isAdmin = user.roles?.includes('admin');
            if (!isAdmin) {
              await updateUserRole(userId, 'admin', user.roles);
            }
            break;
          case 'demote':
            const isCurrentlyAdmin = user.roles?.includes('admin');
            if (isCurrentlyAdmin) {
              await updateUserRole(userId, 'user', user.roles);
            }
            break;
          case 'delete':
            await deleteUser(userId, user.email || '');
            break;
        }
      });

      await Promise.all(promises);
      setSelectedUsers([]);
      
      toast({
        title: "Succès",
        description: `Action ${action} effectuée sur ${selectedUsers.length} utilisateur(s)`,
      });
    } catch (error) {
      logError('Error performing bulk action:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'action groupée",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (updatedUser: UserProfile) => {
    if (!editingUser) return;
    
    const updates: Partial<UserProfile> = {
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone: updatedUser.phone
    };
    
    await updateUserProfile(editingUser.id, updates);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={fetchUsers}
                variant="outline"
                size="sm"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                onClick={() => setShowInviteDialog(true)}
                size="sm"
                className="w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter un utilisateur
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            dateFilter="all"
            setDateFilter={() => {}}
          />

          <div className="grid gap-4">
            {filteredUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onCheckedChange={toggleAllUsers}
                  id="select-all"
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
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
                onUpdateRole={(newRole) => updateUserRole(user.id, newRole, user.roles)}
                onDelete={() => deleteUser(user.id, user.email || '')}
                onManageEnrollments={() => setEnrollmentUser(user)}
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
        onSave={() => editingUser && handleEditUser(editingUser)}
        onCancel={() => setEditingUser(null)}
      />

      <UserEnrollmentDialog
        user={enrollmentUser}
        open={!!enrollmentUser}
        onOpenChange={(open) => !open && setEnrollmentUser(null)}
      />
    </div>
  );
};

export default ComprehensiveUserManagement;