
import React from 'react';
import { Button } from '@/components/ui/button';

interface CourseFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const CourseFormActions: React.FC<CourseFormActionsProps> = ({ 
  onCancel, 
  isSubmitting, 
  isEditing 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : 'Créer'}
      </Button>
    </div>
  );
};

export default CourseFormActions;
