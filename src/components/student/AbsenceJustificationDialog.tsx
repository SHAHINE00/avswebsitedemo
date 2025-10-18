import React, { useState } from 'react';
import { useAbsenceJustifications } from '@/hooks/useAbsenceJustifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface AbsenceJustificationDialogProps {
  attendanceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JUSTIFICATION_TYPES = [
  { value: 'medical', label: 'Raison médicale' },
  { value: 'family_emergency', label: 'Urgence familiale' },
  { value: 'official_event', label: 'Événement officiel' },
  { value: 'other', label: 'Autre' }
];

export const AbsenceJustificationDialog: React.FC<AbsenceJustificationDialogProps> = ({
  attendanceId,
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { createJustification } = useAbsenceJustifications();
  const [formData, setFormData] = useState({
    justification_type: 'medical',
    reason: '',
    document_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const success = await createJustification({
      attendance_id: attendanceId,
      student_id: user.id,
      ...formData,
      document_url: formData.document_url || null
    });
    
    if (success) {
      onOpenChange(false);
      setFormData({
        justification_type: 'medical',
        reason: '',
        document_url: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Justifier une absence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type de justificatif</Label>
            <Select
              value={formData.justification_type}
              onValueChange={(value) => setFormData({ ...formData, justification_type: value })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {JUSTIFICATION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Raison détaillée</Label>
            <Textarea
              placeholder="Expliquez la raison de votre absence..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={4}
            />
          </div>
          <div>
            <Label>Document (URL)</Label>
            <Input
              type="url"
              placeholder="Lien vers le document justificatif (optionnel)"
              value={formData.document_url}
              onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">Soumettre</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
