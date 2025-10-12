import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string) => void;
  onManageEnrollments?: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkAction,
  onManageEnrollments
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} utilisateur(s) sélectionné(s)
      </span>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Désélectionner
        </Button>
        <Button variant="outline" size="sm" onClick={() => onBulkAction('promote')}>
          Promouvoir
        </Button>
        <Button variant="outline" size="sm" onClick={() => onBulkAction('demote')}>
          Rétrograder
        </Button>
        {onManageEnrollments && (
          <Button variant="outline" size="sm" onClick={onManageEnrollments}>
            <GraduationCap className="w-4 h-4 mr-1" />
            Gérer les inscriptions
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={() => onBulkAction('delete')}>
          Supprimer
        </Button>
      </div>
    </div>
  );
};