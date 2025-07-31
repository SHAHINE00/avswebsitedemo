import React, { useMemo } from 'react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';
import FeaturesSection from '@/components/FeaturesSection';
import InstructorsSection from '@/components/InstructorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EnhancedCourseSelectionGuide from '@/components/EnhancedCourseSelectionGuide';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface DynamicPageRendererProps {
  pageName: string;
  children?: React.ReactNode;
}

// Component mapping for section keys
const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  'global_navbar': Navbar,
  'home_hero': HeroSection,
  'home_partners': PartnersSection,
  'home_features': FeaturesSection,
  'home_course_guide': EnhancedCourseSelectionGuide,
  'home_instructors': InstructorsSection,
  'home_testimonials': TestimonialsSection,
  'home_faq': FAQSection,
  'home_cta': CTASection,
  'global_footer': Footer,
};

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ 
  pageName, 
  children 
}) => {
  const { getSectionsByPage, loading } = useSectionVisibility();

  const orderedSections = useMemo(() => {
    if (loading) return [];
    
    // Get sections for both the specific page and global sections
    const pageSpecificSections = getSectionsByPage(pageName);
    const globalSections = getSectionsByPage('global');
    
    // Combine and sort all sections
    const allSections = [...pageSpecificSections, ...globalSections];
    
    return allSections
      .filter(section => section.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
  }, [getSectionsByPage, pageName, loading]);

  const renderSection = (sectionKey: string) => {
    const Component = SECTION_COMPONENTS[sectionKey];
    if (!Component) {
      console.warn(`No component found for section: ${sectionKey}`);
      return null;
    }
    return <Component key={sectionKey} />;
  };

  if (loading) {
    // Show default content while loading to avoid flickering
    return <>{children}</>;
  }

  return (
    <>
      {orderedSections.map(section => renderSection(section.section_key))}
    </>
  );
};

export default DynamicPageRenderer;