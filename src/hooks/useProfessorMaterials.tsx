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
  class_id: string | null;
}

export const useProfessorMaterials = (courseId: string, classId?: string) => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('course_materials')
        .select('id, course_id, class_id, lesson_id, title, description, file_url, file_type, file_size, is_public, download_count, created_at')
        .eq('course_id', courseId);

      // If classId provided, show both class-specific and course-wide materials
      if (classId) {
        query = query.or(`class_id.eq.${classId},class_id.is.null`);
      } else {
        // If no classId, only show course-wide materials
        query = query.is('class_id', null);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const mappedMaterials = (data || []).map(m => ({
        material_id: m.id,
        lesson_id: m.lesson_id,
        title: m.title,
        description: m.description,
        file_url: m.file_url,
        file_type: m.file_type,
        file_size: m.file_size,
        is_public: m.is_public,
        download_count: m.download_count,
        created_at: m.created_at,
        class_id: m.class_id,
      }));

      setMaterials(mappedMaterials);
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
    isPublic: boolean = false,
    materialClassId?: string
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

      // Store relative path instead of full Supabase URL
      const relativeUrl = `/files/course-materials/${filePath}`;

      // Add material record
      const { error: dbError } = await supabase.rpc('add_course_material', {
        p_course_id: courseId,
        p_title: title,
        p_file_url: relativeUrl,
        p_file_type: file.type,
        p_lesson_id: lessonId || null,
        p_description: description || null,
        p_file_size: file.size,
        p_is_public: isPublic,
        p_class_id: materialClassId || classId || null
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
