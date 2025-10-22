import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChatbotFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 5 MB",
          variant: "destructive"
        });
        return null;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Seuls les images (JPEG, PNG, GIF) et PDF sont acceptés",
          variant: "destructive"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `chatbot-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      toast({
        title: "Fichier envoyé",
        description: "Votre fichier a été envoyé avec succès"
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le fichier",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
