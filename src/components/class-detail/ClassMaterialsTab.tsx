import React, { useState, useEffect } from 'react';
import { Download, FileText, FileImage, File, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_type: string;
  file_url: string;
  file_size: number | null;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

interface ClassMaterialsTabProps {
  classId: string;
  courseId: string;
}

export const ClassMaterialsTab: React.FC<ClassMaterialsTabProps> = ({ classId, courseId }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les matériaux',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [classId, courseId]);

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) 
      return <FileImage className="h-5 w-5 text-blue-500" />;
    if (type.includes('zip') || type.includes('archive')) 
      return <Package className="h-5 w-5 text-yellow-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const handleDownload = async (material: Material) => {
    try {
      // In a real app, this would trigger actual download
      // For now, we'll just increment the counter
      await supabase
        .from('course_materials')
        .update({ download_count: material.download_count + 1 })
        .eq('id', material.id);

      fetchMaterials();

      toast({
        title: 'Téléchargement',
        description: `Téléchargement de ${material.title} en cours...`
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le fichier',
        variant: 'destructive'
      });
    }
  };

  const stats = {
    totalMaterials: materials.length,
    totalDownloads: materials.reduce((sum, m) => sum + m.download_count, 0),
    publicMaterials: materials.filter(m => m.is_public).length,
    privateMaterials: materials.filter(m => !m.is_public).length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents publics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicMaterials}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents privés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.privateMaterials}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matériel pédagogique</CardTitle>
          <CardDescription>
            Documents, ressources et supports de cours disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : materials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Taille</TableHead>
                  <TableHead>Visibilité</TableHead>
                  <TableHead className="text-right">Téléchargements</TableHead>
                  <TableHead className="text-right">Date d'ajout</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(material.file_type)}
                        <div>
                          <div className="font-medium">{material.title}</div>
                          {material.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {material.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {material.file_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatFileSize(material.file_size)}
                    </TableCell>
                    <TableCell>
                      {material.is_public ? (
                        <Badge variant="secondary">Public</Badge>
                      ) : (
                        <Badge variant="outline">Privé</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">{material.download_count}</span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {format(new Date(material.created_at), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun matériel pédagogique disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
