import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseMaterial {
  material_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number | null;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

export const useProfessorMaterials = (courseId: string) => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_professor_course_materials', {
        p_course_id: courseId
      });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadMaterial = async (
    file: File,
    title: string,
    description?: string,
    lessonId?: string,
    isPublic: boolean = false
  ) => {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath);

      // Add material record
      const { error: dbError } = await supabase.rpc('add_course_material', {
        p_course_id: courseId,
        p_title: title,
        p_file_url: publicUrl,
        p_file_type: file.type,
        p_lesson_id: lessonId || null,
        p_description: description || null,
        p_file_size: file.size,
        p_is_public: isPublic
      });

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Document téléchargé",
      });

      await fetchMaterials();
      return true;
    } catch (error: any) {
      console.error('Error uploading material:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMaterial = async (materialId: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/');
      const bucketPath = urlParts.slice(-2).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('course-materials')
        .remove([bucketPath]);

      if (storageError) console.warn('Storage delete error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase.rpc('delete_course_material', {
        p_material_id: materialId
      });

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Document supprimé",
      });

      await fetchMaterials();
      return true;
    } catch (error: any) {
      console.error('Error deleting material:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    materials,
    loading,
    fetchMaterials,
    uploadMaterial,
    deleteMaterial
  };
};
