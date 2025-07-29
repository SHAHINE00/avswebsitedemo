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
  Trash2 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UserCardProps {
  user: UserProfile;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onUpdateRole: (newRole: string) => void;
  onDelete: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onToggleSelection,
  onEdit,
  onResetPassword,
  onUpdateRole,
  onDelete
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
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggleSelection}
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
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetPassword}
        >
          <Key className="w-4 h-4" />
        </Button>

        {user.role === 'admin' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('user')}
          >
            <UserX className="w-4 h-4 mr-1" />
            Rétrograder
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateRole('admin')}
          >
            <UserCheck className="w-4 h-4 mr-1" />
            Promouvoir
          </Button>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};