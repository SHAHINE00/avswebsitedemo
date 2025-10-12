import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

// Use the shared UserProfile interface
import type { UserProfile } from './hooks/useUserManagement';

interface UserEditDialogProps {
  user: UserProfile | null;
  onUserChange: (user: UserProfile) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  onUserChange,
  onSave,
  onCancel
}) => {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={() => onCancel()}>
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
              value={user.email || ''}
              onChange={(e) => onUserChange({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-full-name">Nom complet</Label>
            <Input
              id="edit-full-name"
              value={user.full_name || ''}
              onChange={(e) => onUserChange({ ...user, full_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Téléphone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={user.phone || ''}
              onChange={(e) => onUserChange({ ...user, phone: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};