
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

// Safe hooks that handle React null states
const useSafeState = function<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (!React?.useState) {
    console.warn('useSectionVisibility: React.useState not available, using fallback');
    return [initialValue, () => {}];
  }
  try {
    return React.useState(initialValue);
  } catch (error) {
    console.warn('useSectionVisibility: useState failed, using fallback:', error);
    return [initialValue, () => {}];
  }
};

const useSafeEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  if (!React?.useEffect) {
    console.warn('useSectionVisibility: React.useEffect not available');
    return;
  }
  try {
    return React.useEffect(effect, deps);
  } catch (error) {
    console.warn('useSectionVisibility: useEffect failed:', error);
  }
};

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
  // Check React availability first
  if (!React) {
    console.warn('useSectionVisibility: React not available, returning fallback');
    return {
      sections: [],
      loading: false,
      error: 'React not available',
      isSectionVisible: () => true,
      getSectionsByPage: () => [],
      updateSectionVisibility: async () => {},
      updateSectionOrder: async () => {},
      moveSection: async () => {},
      refetch: async () => {}
    };
  }

  const [sections, setSections] = useSafeState<SectionVisibility[]>([]);
  const [loading, setLoading] = useSafeState(true);
  const [error, setError] = useSafeState<string | null>(null);

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
      console.log('🔧 Updating visibility:', { sectionKey, isVisible });
      
      // Direct update without admin check for now - will be handled by RLS
      const { error } = await supabase
        .from('section_visibility')
        .update({ is_visible: isVisible })
        .eq('section_key', sectionKey);

      if (error) {
        console.error('❌ Visibility update failed:', error);
        throw error;
      }

      console.log('✅ Visibility update successful');
      // Update local state
      setSections(prev => 
        prev.map(section => 
          section.section_key === sectionKey 
            ? { ...section, is_visible: isVisible }
            : section
        )
      );
    } catch (err) {
      console.error('❌ Full error in updateSectionVisibility:', err);
      logError('Error updating section visibility:', err);
      throw new Error(`Failed to update section visibility: ${err.message || err}`);
    }
  };

  const updateSectionOrder = async (sectionKey: string, newOrder: number) => {
    try {
      console.log('🔧 Attempting to reorder section:', { sectionKey, newOrder });
      
      // Get the section being moved
      const sectionToUpdate = sections.find(s => s.section_key === sectionKey);
      if (!sectionToUpdate) {
        console.error('❌ Section not found:', sectionKey);
        throw new Error('Section not found');
      }

      console.log('📍 Section found:', sectionToUpdate);

      // Try direct update approach for better compatibility
      console.log('🚀 Using direct update approach');
      
      // Get all sections for this page and sort them
      const pageSections = sections
        .filter(s => s.page_name === sectionToUpdate.page_name)
        .sort((a, b) => a.display_order - b.display_order);

      // Find the current index
      const currentIndex = pageSections.findIndex(s => s.section_key === sectionKey);
      if (currentIndex === -1) throw new Error('Section not found in page sections');

      // Calculate the new position
      const targetIndex = Math.max(0, Math.min(newOrder, pageSections.length - 1));
      
      // Update the display_order for all affected sections
      const updates: Array<{ section_key: string; display_order: number }> = [];
      
      if (currentIndex < targetIndex) {
        // Moving down: shift sections up between current and target
        for (let i = currentIndex + 1; i <= targetIndex; i++) {
          updates.push({
            section_key: pageSections[i].section_key,
            display_order: pageSections[i].display_order - 1
          });
        }
      } else if (currentIndex > targetIndex) {
        // Moving up: shift sections down between target and current
        for (let i = targetIndex; i < currentIndex; i++) {
          updates.push({
            section_key: pageSections[i].section_key,
            display_order: pageSections[i].display_order + 1
          });
        }
      }
      
      // Add the moved section
      updates.push({
        section_key: sectionKey,
        display_order: targetIndex
      });

      // Apply all updates
      for (const update of updates) {
        const { error } = await supabase
          .from('section_visibility')
          .update({ display_order: update.display_order })
          .eq('section_key', update.section_key);
        
        if (error) {
          console.error('❌ Update failed for:', update, error);
          throw error;
        }
      }

      console.log('✅ Direct update successful, refetching sections');
      // Refetch sections to get the updated order
      await fetchSections();
    } catch (err) {
      console.error('❌ Full error in updateSectionOrder:', err);
      logError('Error updating section order:', err);
      throw new Error(`Failed to update section order: ${err.message || err}`);
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

  useSafeEffect(() => {
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
