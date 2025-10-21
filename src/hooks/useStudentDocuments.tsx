import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  admin_notes?: string;
  created_at: string;
}

export const useStudentDocuments = (contextUserId?: string) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getDocuments = async (userId: string, documentType?: string): Promise<StudentDocument[]> => {
    try {
      let query = supabase
        .from('student_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (documentType) {
        query = query.eq('document_type', documentType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      return [];
    }
  };

  const uploadDocument = async (
    userId: string,
    file: File,
    documentType: string,
    documentName?: string
  ) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data, error } = await supabase
        .from('student_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_name: documentName || file.name,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      // Log the upload
      await supabase.rpc('log_storage_access', {
        p_bucket_id: 'student-documents',
        p_object_path: fileName,
        p_action: 'upload',
        p_file_size: file.size,
        p_metadata: { document_type: documentType }
      });

      toast({
        title: "Succès",
        description: "Document téléchargé avec succès"
      });

      return data;
    } catch (error: any) {
      console.error('Error uploading document:', error);
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

  const deleteDocument = async (documentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('student_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Document supprimé"
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting document:', error);
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

  const verifyDocument = async (documentId: string, adminNotes?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('verify_student_document', {
        p_document_id: documentId,
        p_admin_notes: adminNotes
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Document vérifié"
      });

      return true;
    } catch (error: any) {
      console.error('Error verifying document:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la vérification",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (documentUrl: string, fileName: string) => {
    try {
      // Log the download
      await supabase.rpc('log_storage_access', {
        p_bucket_id: 'student-documents',
        p_object_path: documentUrl,
        p_action: 'download',
        p_metadata: { file_name: fileName }
      });

      // Trigger browser download
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = fileName;
      link.click();

      return true;
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive"
      });
      return false;
    }
  };

  const bulkDeleteDocuments = async (documentIds: string[]) => {
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of documentIds) {
        const success = await deleteDocument(id);
        if (success) successCount++;
        else failCount++;
      }

      toast({
        title: successCount > 0 ? "Succès" : "Erreur",
        description: `${successCount} document(s) supprimé(s)${failCount > 0 ? `, ${failCount} échec(s)` : ''}`,
        variant: successCount > 0 ? "default" : "destructive"
      });

      return { successCount, failCount };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploading,
    getDocuments,
    uploadDocument,
    deleteDocument,
    verifyDocument,
    downloadDocument,
    bulkDeleteDocuments
  };
};
