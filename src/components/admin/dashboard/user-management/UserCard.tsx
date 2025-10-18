import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Calendar, 
  Edit, 
  Key, 
  UserCheck, 
  UserX, 
  Trash2,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Use the shared UserProfile interface
import type { UserProfile } from './hooks/useUserManagement';

interface UserCardProps {
  user: UserProfile;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onGenerateResetLink: () => void;
  onUpdateRole: (newRole: string) => void;
  onDelete: () => void;
  onManageEnrollments?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onEdit,
  onResetPassword,
  onGenerateResetLink,
  onUpdateRole,
  onDelete,
  onManageEnrollments
}) => {
  const getUserInitials = (user: UserProfile) => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
          className="shrink-0"
        />
        
        <Avatar className="shrink-0">
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="font-medium truncate">
              {user.full_name || 'Nom non renseigné'}
            </h3>
            <Badge variant={user.roles?.includes('admin') ? 'default' : 'secondary'} className="w-fit">
              {user.roles?.includes('admin') ? 'Admin' : 'Utilisateur'}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>
            {user.created_at && (
              <span className="flex items-center gap-1 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">Inscrit</span>
                <span className="sm:hidden">Il y a</span>
                {' '}
                {formatDistanceToNow(new Date(user.created_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="h-8"
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetPassword}
          className="h-8"
          title="Envoyer email de réinitialisation"
        >
          <Key className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateResetLink}
          className="h-8"
          title="Générer lien de réinitialisation"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {onManageEnrollments && (
          <Button
            variant="outline"
            size="sm"
            onClick={onManageEnrollments}
            className="h-8"
          >
            <BookOpen className="w-4 h-4" />
          </Button>
        )}

        {user.roles?.includes('admin') ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('user')}
            className="h-8"
          >
            <UserX className="w-4 h-4 mr-1" />
            <span className="hidden xl:inline">Rétrograder</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('admin')}
            className="h-8"
          >
            <UserCheck className="w-4 h-4 mr-1" />
            <span className="hidden xl:inline">Promouvoir</span>
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="h-8"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Actions */}
      <div className="flex lg:hidden gap-2 pt-2 border-t sm:border-t-0 sm:pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 h-9"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetPassword}
          className="flex-1 h-9"
          title="Envoyer email"
        >
          <Key className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Email MDP</span>
          <span className="sm:hidden">Email</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateResetLink}
          className="flex-1 h-9"
          title="Générer lien"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Lien MDP</span>
          <span className="sm:hidden">Lien</span>
        </Button>

        {onManageEnrollments && (
          <Button
            variant="outline"
            size="sm"
            onClick={onManageEnrollments}
            className="flex-1 h-9"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Inscriptions</span>
            <span className="sm:hidden">Cours</span>
          </Button>
        )}

        {user.roles?.includes('admin') ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('user')}
            className="flex-1 h-9"
          >
            <UserX className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Rétrograder</span>
            <span className="sm:hidden">Démo</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('admin')}
            className="flex-1 h-9"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Promouvoir</span>
            <span className="sm:hidden">Promo</span>
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1 h-9"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Suppr.
        </Button>
      </div>
    </div>
  );
};