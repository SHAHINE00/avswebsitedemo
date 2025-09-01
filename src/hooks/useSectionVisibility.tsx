
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
      
      // Check admin status first
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('check_admin_role');
      
      console.log('🔐 Admin check for visibility:', { adminCheck, adminError });

      if (adminError) {
        console.error('❌ Admin check failed:', adminError);
        throw new Error('Failed to verify admin status');
      }

      if (!adminCheck) {
        console.error('❌ User is not admin');
        throw new Error('Admin privileges required for managing section visibility');
      }

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

      // Check admin status first
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('check_admin_role');
      
      console.log('🔐 Admin check result:', { adminCheck, adminError });

      if (adminError) {
        console.error('❌ Admin check failed:', adminError);
        throw new Error('Failed to verify admin status');
      }

      if (!adminCheck) {
        console.error('❌ User is not admin');
        throw new Error('Admin privileges required for reordering sections');
      }

      // Use the database function for proper reordering
      console.log('🚀 Calling reorder function with:', {
        p_page_name: sectionToUpdate.page_name,
        p_section_key: sectionKey,
        p_new_order: newOrder
      });

      const { error } = await supabase
        .rpc('reorder_sections_on_page', {
          p_page_name: sectionToUpdate.page_name,
          p_section_key: sectionKey,
          p_new_order: newOrder
        });

      if (error) {
        console.error('❌ Reorder function failed:', error);
        throw error;
      }

      console.log('✅ Reorder successful, refetching sections');
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
