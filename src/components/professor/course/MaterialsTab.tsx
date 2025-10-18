import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import { useProfessorMaterials } from '@/hooks/useProfessorMaterials';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface MaterialsTabProps {
  courseId: string;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ courseId }) => {
  const { materials, loading, fetchMaterials, uploadMaterial, deleteMaterial } = useProfessorMaterials(courseId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    const success = await uploadMaterial(
      file,
      formData.title,
      formData.description,
      undefined,
      formData.isPublic
    );
    
    if (success) {
      setDialogOpen(false);
      setFile(null);
      setFormData({
        title: '',
        description: '',
        isPublic: false
      });
    }
  };

  const handleDelete = async (materialId: string, fileUrl: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      await deleteMaterial(materialId, fileUrl);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents du cours</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Télécharger un document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Titre du document</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Cours Chapitre 1"
                  required
                />
              </div>
              <div>
                <Label>Description (optionnelle)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                  onCheckedChange={(checked) => setFormData({...formData, isPublic: checked})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={!file}>
                Télécharger
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Chargement...</p>
        ) : materials.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun document téléchargé</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Visibilité</TableHead>
                <TableHead>Téléchargements</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.material_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {material.title}
                    </div>
                  </TableCell>
                  <TableCell>{material.file_type.split('/')[1]?.toUpperCase() || 'File'}</TableCell>
                  <TableCell>{formatFileSize(material.file_size)}</TableCell>
                  <TableCell>{material.is_public ? 'Public' : 'Privé'}</TableCell>
                  <TableCell>{material.download_count}</TableCell>
                  <TableCell>{new Date(material.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(material.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(material.material_id, material.file_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
