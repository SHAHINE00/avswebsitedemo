import React from 'react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

interface SectionDebuggerProps {
  sectionKey: string;
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType;
}

/**
 * Debug wrapper component to investigate rendering issues
 */
const SectionDebugger: React.FC<SectionDebuggerProps> = ({ 
  sectionKey, 
  children, 
  fallbackComponent: FallbackComponent 
}) => {
  const { sections, loading, isSectionVisible } = useSectionVisibility();
  
  const sectionData = sections.find(s => s.section_key === sectionKey);
  const isVisible = isSectionVisible(sectionKey);
  
  // Debug logging
  React.useEffect(() => {
    console.log(`🔍 SectionDebugger [${sectionKey}]:`, {
      sectionData,
      isVisible,
      loading,
      totalSections: sections.length,
      sectionsForThisPage: sections.filter(s => s.page_name === sectionData?.page_name).length
    });
  }, [sectionKey, sectionData, isVisible, loading, sections]);

  // If section isn't visible, show debug info and fallback
  if (!isVisible || !sectionData) {
    console.warn(`🚨 Section not visible: ${sectionKey}`, { sectionData, isVisible });
    
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="bg-red-50 border-2 border-red-200 p-4 m-4 rounded-lg">
          <h3 className="text-red-800 font-bold">Debug: Section Not Visible</h3>
          <p className="text-red-700">Section Key: <code>{sectionKey}</code></p>
          <p className="text-red-700">Visibility: {isVisible ? 'true' : 'false'}</p>
          <p className="text-red-700">Section Found: {sectionData ? 'true' : 'false'}</p>
          <p className="text-red-700">Loading: {loading ? 'true' : 'false'}</p>
          {sectionData && (
            <details className="text-sm text-red-600 mt-2">
              <summary>Section Data</summary>
              <pre className="bg-red-100 p-2 rounded mt-1 text-xs overflow-auto">
                {JSON.stringify(sectionData, null, 2)}
              </pre>
            </details>
          )}
          {FallbackComponent && (
            <div className="mt-4">
              <p className="text-red-700 mb-2">Rendering fallback component:</p>
              <FallbackComponent />
            </div>
          )}
        </div>
      );
    }
    
    return FallbackComponent ? <FallbackComponent /> : null;
  }

  // Section is visible, render with visual debug indicator
  return (
    <div className="relative">
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs z-50 rounded-bl">
          ✓ {sectionKey} (order: {sectionData.display_order})
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionDebugger;