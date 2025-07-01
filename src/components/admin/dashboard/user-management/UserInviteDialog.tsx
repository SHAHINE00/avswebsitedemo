import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteMessage: string;
  setInviteMessage: (message: string) => void;
  onInvite: () => void;
}

export const UserInviteDialog: React.FC<UserInviteDialogProps> = ({
  open,
  onOpenChange,
  inviteEmail,
  setInviteEmail,
  inviteMessage,
  setInviteMessage,
  onInvite
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onInvite}>
            Envoyer l'invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};