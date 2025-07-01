import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, UserCheck, UserX, Trash2 } from 'lucide-react';

interface BulkActionsTabProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export const BulkActionsTab: React.FC<BulkActionsTabProps> = ({
  selectedCount,
  onBulkAction
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Groupées</CardTitle>
        <CardDescription>
          Effectuer des actions sur plusieurs utilisateurs à la fois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Sélectionnez des utilisateurs dans l'onglet "Gestion Utilisateurs" pour utiliser les actions groupées.
            </AlertDescription>
          </Alert>
          
          {selectedCount > 0 && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedCount} utilisateur(s) sélectionné(s)
                </h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onBulkAction('promote')}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Promouvoir en Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onBulkAction('demote')}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Rétrograder en User
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => onBulkAction('delete')}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};