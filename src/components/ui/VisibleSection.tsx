import React from 'react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

interface VisibleSectionProps {
  sectionKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that conditionally renders children based on section visibility settings
 * Used to control which sections appear on the live website
 */
const VisibleSection: React.FC<VisibleSectionProps> = ({ 
  sectionKey, 
  children, 
  fallback = null 
}) => {
  const { isSectionVisible, loading } = useSectionVisibility();

  // Show content while loading to avoid flickering
  if (loading) {
    return <>{children}</>;
  }

  // Check if section should be visible
  const isVisible = isSectionVisible(sectionKey);

  if (!isVisible) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default VisibleSection;