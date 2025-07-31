import React, { useMemo } from 'react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
// Global components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// Home page components
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';
import FeaturesSection from '@/components/FeaturesSection';
import InstructorsSection from '@/components/InstructorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EnhancedCourseSelectionGuide from '@/components/EnhancedCourseSelectionGuide';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
// About page components
import AboutHeroSection from '@/components/about/AboutHeroSection';
import AboutMissionSection from '@/components/about/AboutMissionSection';
import AboutValuesSection from '@/components/about/AboutValuesSection';
import AboutStatsSection from '@/components/about/AboutStatsSection';
import AboutHistorySection from '@/components/about/AboutHistorySection';
import AboutCTASection from '@/components/about/AboutCTASection';
// Features page components
import FeaturesHeroSection from '@/components/features/FeaturesHeroSection';
import FeaturesMainSection from '@/components/features/FeaturesMainSection';

interface DynamicPageRendererProps {
  pageName: string;
  children?: React.ReactNode;
}

// Component mapping for section keys
const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  // Global components
  'global_navbar': Navbar,
  'global_footer': Footer,
  
  // Home page sections
  'home_hero': HeroSection,
  'home_partners': PartnersSection,
  'home_features': FeaturesSection,
  'home_course_guide': EnhancedCourseSelectionGuide,
  'home_instructors': InstructorsSection,
  'home_testimonials': TestimonialsSection,
  'home_faq': FAQSection,
  'home_cta': CTASection,
  
  // About page sections
  'about_hero': AboutHeroSection,
  'about_mission': AboutMissionSection,
  'about_values': AboutValuesSection,
  'about_stats': AboutStatsSection,
  'about_history': AboutHistorySection,
  'about_cta': AboutCTASection,
  
  // Features page sections
  'features_hero': FeaturesHeroSection,
  'features_main': FeaturesMainSection,
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
    
    // Filter visible sections
    const visiblePageSections = pageSpecificSections.filter(section => section.is_visible);
    const visibleGlobalSections = globalSections.filter(section => section.is_visible);
    
    // Sort page sections by display order
    const sortedPageSections = visiblePageSections.sort((a, b) => a.display_order - b.display_order);
    
    // Separate global sections
    const navbar = visibleGlobalSections.find(section => section.section_key === 'global_navbar');
    const footer = visibleGlobalSections.find(section => section.section_key === 'global_footer');
    
    // Combine in correct order: navbar first, then page content, then footer
    const result = [];
    if (navbar) result.push(navbar);
    result.push(...sortedPageSections);
    if (footer) result.push(footer);
    
    return result;
  }, [getSectionsByPage, pageName, loading]);

  const renderSection = (sectionKey: string) => {
    const Component = SECTION_COMPONENTS[sectionKey];
    if (!Component) {
      console.warn(`No component found for section: ${sectionKey}. Available sections:`, Object.keys(SECTION_COMPONENTS));
      // In development, show a placeholder for missing components
      if (process.env.NODE_ENV === 'development') {
        return (
          <div key={sectionKey} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4">
            <p className="font-bold">Missing Component: {sectionKey}</p>
            <p className="text-sm">This section exists in the database but no React component is mapped to it.</p>
          </div>
        );
      }
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