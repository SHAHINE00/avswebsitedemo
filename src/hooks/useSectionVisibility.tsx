import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

interface SectionVisibility {
  id: string;
  section_key: string;
  section_name: string;
  section_description?: string;
  is_visible: boolean;
  page_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useSectionVisibility = () => {
  const [sections, setSections] = useState<SectionVisibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*')
        .order('page_name', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      logError('Error fetching section visibility:', err);
      setError('Failed to fetch section visibility settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSectionVisibility = async (sectionKey: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility')
        .update({ is_visible: isVisible })
        .eq('section_key', sectionKey);

      if (error) throw error;

      // Update local state
      setSections(prev => 
        prev.map(section => 
          section.section_key === sectionKey 
            ? { ...section, is_visible: isVisible }
            : section
        )
      );
    } catch (err) {
      logError('Error updating section visibility:', err);
      throw new Error('Failed to update section visibility');
    }
  };

  const updateSectionOrder = async (sectionKey: string, newOrder: number) => {
    try {
      // Get the section being moved
      const sectionToUpdate = sections.find(s => s.section_key === sectionKey);
      if (!sectionToUpdate) throw new Error('Section not found');

      // Use the database function for proper reordering
      const { error } = await supabase
        .rpc('reorder_sections_on_page', {
          p_page_name: sectionToUpdate.page_name,
          p_section_key: sectionKey,
          p_new_order: newOrder
        });

      if (error) throw error;

      // Refetch sections to get the updated order
      await fetchSections();
    } catch (err) {
      logError('Error updating section order:', err);
      throw new Error('Failed to update section order');
    }
  };

  const moveSection = async (sectionKey: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    try {
      const section = sections.find(s => s.section_key === sectionKey);
      if (!section) throw new Error('Section not found');

      const samePage = sections.filter(s => s.page_name === section.page_name);
      const maxOrder = Math.max(...samePage.map(s => s.display_order));
      
      let newOrder: number;
      
      switch (direction) {
        case 'up':
          newOrder = Math.max(0, section.display_order - 1);
          break;
        case 'down':
          newOrder = Math.min(maxOrder, section.display_order + 1);
          break;
        case 'top':
          newOrder = 0;
          break;
        case 'bottom':
          newOrder = maxOrder;
          break;
      }
      
      await updateSectionOrder(sectionKey, newOrder);
    } catch (err) {
      logError('Error moving section:', err);
      throw new Error('Failed to move section');
    }
  };

  const isSectionVisible = (sectionKey: string): boolean => {
    const section = sections.find(s => s.section_key === sectionKey);
    return section?.is_visible ?? true; // Default to visible if not found
  };

  const getSectionsByPage = (pageName: string): SectionVisibility[] => {
    return sections
      .filter(section => section.page_name === pageName)
      .sort((a, b) => a.display_order - b.display_order);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    loading,
    error,
    isSectionVisible,
    getSectionsByPage,
    updateSectionVisibility,
    updateSectionOrder,
    moveSection,
    refetch: fetchSections
  };
};