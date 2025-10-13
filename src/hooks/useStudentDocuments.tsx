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
  created_at: string;
}

export const useStudentDocuments = () => {
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

  const verifyDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('student_documents')
        .update({ is_verified: true })
        .eq('id', documentId);

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
    }
  };

  return {
    loading,
    uploading,
    getDocuments,
    uploadDocument,
    deleteDocument,
    verifyDocument
  };
};
