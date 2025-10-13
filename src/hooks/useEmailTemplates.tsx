import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  variables: any;
  created_at: string;
}

export const useEmailTemplates = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getTemplates = async (): Promise<EmailTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      return [];
    }
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Template créé avec succès"
      });

      return data;
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du template",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Template mis à jour"
      });

      return true;
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Template supprimé"
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
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

  return {
    loading,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
