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

      // Use direct client-side approach for better reliability
      const pageSections = sections
        .filter(s => s.page_name === sectionToUpdate.page_name)
        .sort((a, b) => a.display_order - b.display_order);

      const currentIndex = pageSections.findIndex(s => s.section_key === sectionKey);
      const targetIndex = Math.max(0, Math.min(newOrder, pageSections.length - 1));

      if (currentIndex === targetIndex) {
        console.log('🔄 No movement needed');
        return;
      }

      console.log(`🚀 Client-side reorder: ${currentIndex} → ${targetIndex}`);

      // Create reordered array to calculate new positions
      const reorderedSections = [...pageSections];
      const [movedSection] = reorderedSections.splice(currentIndex, 1);
      reorderedSections.splice(targetIndex, 0, movedSection);

      // Update all affected sections in batch
      const updates = reorderedSections.map((section, index) => ({
        section_key: section.section_key,
        new_order: index
      })).filter(update => {
        const originalSection = pageSections.find(s => s.section_key === update.section_key);
        return originalSection && originalSection.display_order !== update.new_order;
      });

      console.log('📦 Batch updates:', updates);

      // Apply updates sequentially to avoid constraint conflicts
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const tempOrder = 10000 + i; // Use temporary high values first
        
        const { error: tempError } = await supabase
          .from('section_visibility')
          .update({ display_order: tempOrder })
          .eq('section_key', update.section_key);
          
        if (tempError) {
          console.error('❌ Temp update failed:', tempError);
          throw tempError;
        }
      }

      // Now apply final orders
      for (const update of updates) {
        const { error } = await supabase
          .from('section_visibility')
          .update({ display_order: update.new_order })
          .eq('section_key', update.section_key);
          
        if (error) {
          console.error('❌ Final update failed:', error);
          throw error;
        }
      }

      console.log('✅ Reorder successful, refetching sections');
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

      // Get correctly ordered sections for this page
      const samePage = sections
        .filter(s => s.page_name === section.page_name)
        .sort((a, b) => a.display_order - b.display_order);
      
      const currentIndex = samePage.findIndex(s => s.section_key === sectionKey);
      let newOrder: number;
      
      switch (direction) {
        case 'up':
          if (currentIndex > 0) {
            newOrder = currentIndex - 1;
          } else {
            return; // Already at top
          }
          break;
        case 'down':
          if (currentIndex < samePage.length - 1) {
            newOrder = currentIndex + 1;
          } else {
            return; // Already at bottom
          }
          break;
        case 'top':
          if (currentIndex === 0) return; // Already at top
          newOrder = 0;
          break;
        case 'bottom':
          if (currentIndex === samePage.length - 1) return; // Already at bottom
          newOrder = samePage.length - 1;
          break;
        default:
          throw new Error('Invalid direction');
      }
      
      console.log(`🔄 Moving section ${direction}: ${currentIndex} → ${newOrder}`);
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