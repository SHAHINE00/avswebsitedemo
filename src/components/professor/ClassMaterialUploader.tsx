import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useProfessorMaterials } from '@/hooks/useProfessorMaterials';

interface ClassMaterialUploaderProps {
  courseId: string;
  classId: string;
  onSuccess?: () => void;
}

export const ClassMaterialUploader: React.FC<ClassMaterialUploaderProps> = ({
  courseId,
  classId,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false,
  });

  const { uploadMaterial } = useProfessorMaterials(courseId, classId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const success = await uploadMaterial(
      file,
      formData.title,
      formData.description,
      undefined,
      formData.isPublic,
      classId
    );

    if (success) {
      setIsOpen(false);
      setFile(null);
      setFormData({
        title: '',
        description: '',
        isPublic: false,
      });
      onSuccess?.();
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un document de classe
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document pour cette classe</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Titre du document</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Exercices Chapitre 3"
                required
              />
            </div>
            <div>
              <Label>Description (optionnelle)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du document..."
                rows={3}
              />
            </div>
            <div>
              <Label>Fichier</Label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="public">Document public</Label>
              <Switch
                id="public"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!file}>
              Télécharger
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};