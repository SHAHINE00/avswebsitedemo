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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';

interface AbsenceJustificationDialogProps {
  attendanceId: string;
  attendanceDate?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AbsenceJustificationDialog: React.FC<AbsenceJustificationDialogProps> = ({
  attendanceId,
  attendanceDate,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [justificationType, setJustificationType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!justificationType || !reason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await (supabase.rpc as any)('submit_absence_justification', {
        p_attendance_id: attendanceId,
        p_justification_type: justificationType,
        p_reason: reason
      });

      if (error) throw error;

      toast({
        title: "Justification soumise",
        description: "Votre justification a été envoyée avec succès"
      });

      onOpenChange(false);
      setJustificationType('');
      setReason('');
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Justifier une absence</DialogTitle>
          <DialogDescription>
            {attendanceDate 
              ? `Soumettez une justification pour l'absence du ${new Date(attendanceDate).toLocaleDateString('fr-FR')}`
              : 'Soumettez une justification pour cette absence'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de justification</Label>
            <Select value={justificationType} onValueChange={setJustificationType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Certificat médical</SelectItem>
                <SelectItem value="family">Raisons familiales</SelectItem>
                <SelectItem value="administrative">Raisons administratives</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison détaillée</Label>
            <Textarea
              id="reason"
              placeholder="Décrivez la raison de votre absence..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Envoi...' : 'Soumettre'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
