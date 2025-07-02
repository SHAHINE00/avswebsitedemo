import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';
import { CourseMaterial } from '@/hooks/useCourseContent';

interface MaterialsTabProps {
  materials: CourseMaterial[];
  onCreateMaterial: () => void;
}

const MaterialsTab = ({ materials, onCreateMaterial }: MaterialsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Matériaux du cours</h3>
        <Button
          onClick={onCreateMaterial}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau matériau
        </Button>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{material.title}</h4>
                  {material.description && (
                    <p className="text-sm text-muted-foreground">
                      {material.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{material.file_type}</Badge>
                    {material.is_public && (
                      <Badge variant="secondary">Public</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {material.download_count} téléchargements
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {materials.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun matériau</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des fichiers et ressources pour ce cours.
              </p>
              <Button onClick={onCreateMaterial}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un matériau
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MaterialsTab;