
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar,
  TrendingUp,
  Shield,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminActivityLogs } from '@/hooks/useAdminActivityLogs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const { toast } = useToast();
  const { logActivity } = useAdminActivityLogs();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy]);

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
      
      return matchesSearch && matchesRole;
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

      {/* User Management Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>Recherche, filtrage et gestion des rôles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-6">
            {/* Search and Filters */}
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
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
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
    </div>
  );
};

export default ComprehensiveUserManagement;
