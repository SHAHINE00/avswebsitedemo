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
    if (!uploaderId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return { successCount: 0, failCount: studentIds.length, skippedCount: 0 };
    }

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
      const successfulStudents: string[] = [];
      
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
            successfulStudents.push(studentId);
          }
        } catch (error: any) {
          failCount++;
          errors.push({ studentId, error: error.message || 'Erreur inconnue' });
        }
      }

      // Step 3: Create notifications for all successful recipients
      if (successfulStudents.length > 0) {
        try {
          const notificationTitle = uploaderRole === 'professor' 
            ? 'Nouveau document de votre professeur'
            : 'Nouveau document administratif';
          
          const notificationMessage = `Vous avez reçu un nouveau document: ${documentName}`;
          
          await Promise.all(
            successfulStudents.map(studentId =>
              supabase.rpc('create_notification', {
                p_user_id: studentId,
                p_title: notificationTitle,
                p_message: notificationMessage,
                p_type: 'document',
                p_action_url: '/student?tab=documents'
              })
            )
          );
        } catch (notifError) {
          console.error('Error creating notifications:', notifError);
          // Don't fail the operation if notifications fail
        }
      }

      // Step 4: Log admin activity for tracking
      if (successCount > 0) {
        try {
          await supabase.rpc('log_admin_activity', {
            p_action: 'bulk_document_upload',
            p_entity_type: 'student_documents',
            p_entity_id: null,
            p_details: {
              document_type: documentType,
              document_name: documentName,
              file_url: publicUrl,
              uploaded_by_role: uploaderRole,
              student_count: successCount,
              file_size: file.size,
              successful_students: successfulStudents
            }
          });
        } catch (logError) {
          console.error('Error logging activity:', logError);
          // Don't fail the operation if logging fails
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
