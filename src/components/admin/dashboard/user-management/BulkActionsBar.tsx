import React from 'react';
import { Button } from '@/components/ui/button';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkAction
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} utilisateur(s) sélectionné(s)
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Désélectionner
        </Button>
        <Button variant="outline" size="sm" onClick={() => onBulkAction('promote')}>
          Promouvoir
        </Button>
        <Button variant="outline" size="sm" onClick={() => onBulkAction('demote')}>
          Rétrograder
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onBulkAction('delete')}>
          Supprimer
        </Button>
      </div>
    </div>
  );
};