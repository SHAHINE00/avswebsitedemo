import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, AlertTriangle, Shield } from 'lucide-react';

interface DataDeletionDialogProps {
  children: React.ReactNode;
}

const DataDeletionDialog: React.FC<DataDeletionDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleRequestDeletion = async () => {
    try {
      setIsDeleting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Create deletion request (in real app, this would go to admin queue)
      const deletionRequest = {
        user_id: user.id,
        requested_at: new Date().toISOString(),
        reason: reason || 'Demande de suppression RGPD',
        status: 'pending'
      };

      // For now, just log the request (in production, store in database)
      console.log('Deletion request:', deletionRequest);

      // Send email notification to admins (would be handled by edge function)
      await supabase.functions.invoke('send-hostinger-email', {
        body: {
          to: 'admin@avsinstitut.com',
          subject: 'Demande de suppression de données RGPD',
          text: `
Nouvelle demande de suppression de données:

Utilisateur: ${user.email}
Date: ${new Date().toLocaleString('fr-FR')}
Raison: ${reason || 'Non spécifiée'}

Veuillez traiter cette demande dans les 30 jours conformément au RGPD.
          `
        }
      });

      toast({
        title: 'Demande Envoyée',
        description: 'Votre demande de suppression a été envoyée. Nous la traiterons dans les 30 jours.',
      });

      setIsOpen(false);
      setConfirmDelete(false);
      setReason('');
    } catch (error) {
      console.error('Deletion request error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de votre demande.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Supprimer Mes Données
          </DialogTitle>
          <DialogDescription>
            Demander la suppression définitive de toutes vos données personnelles.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Attention</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tous vos cours et progrès seront perdus</li>
                    <li>• Vos certificats ne seront plus accessibles</li>
                    <li>• Cette action ne peut pas être annulée</li>
                    <li>• Traitement sous 30 jours (délai légal RGPD)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Raison de la suppression (optionnel)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi vous souhaitez supprimer vos données..."
              className="min-h-[80px]"
            />
          </div>

          <Card className="border-muted bg-muted/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium mb-1">Données Conservées</h4>
                  <p className="text-muted-foreground">
                    Conformément au RGPD, certaines données peuvent être conservées pour des obligations légales
                    (facturation, audit) pendant la durée requise par la loi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-delete"
              checked={confirmDelete}
              onCheckedChange={(checked) => setConfirmDelete(!!checked)}
            />
            <label
              htmlFor="confirm-delete"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Je confirme vouloir supprimer définitivement mes données
            </label>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleRequestDeletion}
              disabled={!confirmDelete || isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? 'Envoi en cours...' : 'Demander la Suppression'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataDeletionDialog;