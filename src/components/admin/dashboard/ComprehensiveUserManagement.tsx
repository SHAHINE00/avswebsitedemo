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
import { BulkEnrollmentDialog } from './user-management/BulkEnrollmentDialog';
import { useUserManagement, type UserProfile } from './user-management/hooks/useUserManagement';
import { useUserFilters } from './user-management/hooks/useUserFilters';
import { useBulkEnrollments } from '@/hooks/useBulkEnrollments';
import { supabase } from '@/integrations/supabase/client';

const ComprehensiveUserManagement = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [enrollmentUser, setEnrollmentUser] = useState<UserProfile | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [bulkEnrollmentOpen, setBulkEnrollmentOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
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

  const { bulkEnroll, bulkUnenroll, loading: enrollmentLoading } = useBulkEnrollments();

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
    if (selectedUsers.length === 0) return;

    setBulkActionLoading(true);
    try {
      if (action === 'promote') {
        const { data, error } = await supabase.rpc('bulk_promote_users_to_admin', {
          p_user_ids: selectedUsers
        });
        
        if (error) throw error;
        
        const result = data as unknown as { success_count: number; failed_count: number };
        toast({
          title: 'Utilisateurs promus',
          description: `${result.success_count} utilisateur(s) promu(s)${
            result.failed_count > 0 ? `, ${result.failed_count} échec(s)` : ''
          }`,
        });
      } else if (action === 'demote') {
        const { data, error } = await supabase.rpc('bulk_demote_users_to_student', {
          p_user_ids: selectedUsers
        });
        
        if (error) throw error;
        
        const result = data as unknown as { success_count: number; failed_count: number };
        toast({
          title: 'Utilisateurs rétrogradés',
          description: `${result.success_count} utilisateur(s) rétrogradé(s)${
            result.failed_count > 0 ? `, ${result.failed_count} échec(s)` : ''
          }`,
        });
      } else if (action === 'delete') {
        await Promise.all(selectedUsers.map(userId => {
          const user = users.find(u => u.id === userId);
          return deleteUser(userId, user?.email || '');
        }));
        toast({
          title: 'Utilisateurs supprimés',
          description: `${selectedUsers.length} utilisateur(s) supprimé(s)`,
        });
      }
      
      setSelectedUsers([]);
      await fetchUsers();
    } catch (error) {
      logError('Error performing bulk action:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'action groupée",
        variant: "destructive",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkEnroll = async (courseId: string) => {
    await bulkEnroll(selectedUsers, courseId);
    setSelectedUsers([]);
    await fetchUsers();
  };

  const handleBulkUnenroll = async (courseId: string) => {
    await bulkUnenroll(selectedUsers, courseId);
    setSelectedUsers([]);
    await fetchUsers();
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

          <BulkActionsBar
            selectedCount={selectedUsers.length}
            onClearSelection={() => setSelectedUsers([])}
            onBulkAction={handleBulkAction}
            onManageEnrollments={() => setBulkEnrollmentOpen(true)}
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

      <BulkEnrollmentDialog
        selectedUserIds={selectedUsers}
        open={bulkEnrollmentOpen}
        onOpenChange={setBulkEnrollmentOpen}
        onEnroll={handleBulkEnroll}
        onUnenroll={handleBulkUnenroll}
        loading={enrollmentLoading || bulkActionLoading}
      />
    </div>
  );
};

export default ComprehensiveUserManagement;