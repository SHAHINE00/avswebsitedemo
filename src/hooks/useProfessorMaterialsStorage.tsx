import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfessorMaterial {
  id: string;
  professor_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description?: string;
  created_at: string;
}

export const useProfessorMaterialsStorage = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadMaterial = async (
    professorId: string,
    file: File,
    description?: string
  ) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${professorId}/${Date.now()}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('professor-materials')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('professor-materials')
        .getPublicUrl(fileName);

      // Log the upload
      await supabase.rpc('log_storage_access', {
        p_bucket_id: 'professor-materials',
        p_object_path: fileName,
        p_action: 'upload',
        p_file_size: file.size,
        p_metadata: { 
          professor_id: professorId,
          file_name: file.name,
          description 
        }
      });

      toast({
        title: "Succès",
        description: "Document téléchargé avec succès"
      });

      return {
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      };
    } catch (error: any) {
      console.error('Error uploading material:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du téléchargement",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (filePath: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.storage
        .from('professor-materials')
        .remove([filePath]);

      if (error) throw error;

      // Log the deletion
      await supabase.rpc('log_storage_access', {
        p_bucket_id: 'professor-materials',
        p_object_path: filePath,
        p_action: 'delete',
        p_metadata: {}
      });

      toast({
        title: "Succès",
        description: "Document supprimé"
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting material:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const listMaterials = async (professorId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('professor-materials')
        .list(professorId);

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error listing materials:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des documents",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploading,
    uploadMaterial,
    deleteMaterial,
    listMaterials
  };
};
