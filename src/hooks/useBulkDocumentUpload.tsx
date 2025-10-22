import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BulkDocumentResult {
  successCount: number;
  failCount: number;
  skippedCount: number;
  errors?: Array<{ studentId: string; error: string }>;
}

export const useBulkDocumentUpload = (uploaderId?: string) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const uploadDocumentToMultipleStudents = async (
    studentIds: string[],
    file: File,
    documentType: string,
    documentName: string,
    note: string,
    uploaderRole: 'professor' | 'admin'
  ): Promise<BulkDocumentResult> => {
    setLoading(true);
    setProgress({ current: 0, total: studentIds.length });

    let successCount = 0;
    let failCount = 0;
    const errors: Array<{ studentId: string; error: string }> = [];

    try {
      // Step 1: Upload the file once to shared location
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const sharedFileName = `bulk-documents/${timestamp}/${documentName}.${fileExt}`;

      toast({
        title: "Upload en cours",
        description: "Téléchargement du fichier...",
      });

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(sharedFileName, file);

      if (uploadError) {
        toast({
          title: "Erreur",
          description: "Échec du téléchargement du fichier",
          variant: "destructive"
        });
        return { successCount: 0, failCount: studentIds.length, skippedCount: 0 };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-documents')
        .getPublicUrl(sharedFileName);

      // Log the shared upload (optional, non-critical)
      try {
        await supabase.rpc('log_storage_access', {
          p_bucket_id: 'student-documents',
          p_object_path: sharedFileName,
          p_action: 'upload',
          p_file_size: file.size,
          p_metadata: { 
            document_type: documentType,
            bulk_upload: true,
            uploaded_by_role: uploaderRole,
            student_count: studentIds.length
          }
        });
      } catch {
        // Non-critical error, continue
      }

      toast({
        title: "Envoi aux étudiants",
        description: `Envoi en cours à ${studentIds.length} étudiant(s)...`,
      });

      // Step 2: Create individual records for each student
      for (let i = 0; i < studentIds.length; i++) {
        const studentId = studentIds[i];
        setProgress({ current: i + 1, total: studentIds.length });

        try {
          const documentRecord = {
            user_id: studentId,
            document_type: documentType,
            document_name: documentName,
            file_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: uploaderId,
            uploaded_by_role: uploaderRole,
            is_visible_to_student: true,
            ...(uploaderRole === 'professor' ? { professor_note: note } : { admin_notes: note })
          };

          const { error } = await supabase
            .from('student_documents')
            .insert(documentRecord);

          if (error) {
            failCount++;
            errors.push({ studentId, error: error.message });
          } else {
            successCount++;
          }
        } catch (error: any) {
          failCount++;
          errors.push({ studentId, error: error.message || 'Erreur inconnue' });
        }
      }

      // Show final result
      if (failCount === 0) {
        toast({
          title: "Succès",
          description: `Document envoyé à ${successCount} étudiant(s)`,
        });
      } else if (successCount === 0) {
        toast({
          title: "Échec",
          description: `Impossible d'envoyer le document`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Envoi partiel",
          description: `${successCount} réussi(s), ${failCount} échec(s)`,
          variant: "default"
        });
      }

      return { successCount, failCount, skippedCount: 0, errors };

    } catch (error: any) {
      console.error('Bulk document upload error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi des documents",
        variant: "destructive"
      });
      return { successCount: 0, failCount: studentIds.length, skippedCount: 0 };
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return {
    loading,
    progress,
    uploadDocumentToMultipleStudents
  };
};
