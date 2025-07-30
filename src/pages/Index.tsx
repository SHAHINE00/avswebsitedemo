
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import InstructorsSection from '@/components/InstructorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EnhancedCourseSelectionGuide from '@/components/EnhancedCourseSelectionGuide';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import VisibleSection from '@/components/ui/VisibleSection';
import { pageSEO } from '@/utils/seoData';

const Index = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <SEOHead {...pageSEO.home} />
      
      <VisibleSection sectionKey="global_navbar">
        <Navbar />
      </VisibleSection>
      
      <div style={{ paddingTop: '4rem' }}>
        <VisibleSection sectionKey="home_hero">
          <HeroSection />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_features">
          <FeaturesSection />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_course_guide">
          <EnhancedCourseSelectionGuide />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_instructors">
          <InstructorsSection />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_testimonials">
          <TestimonialsSection />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_faq">
          <FAQSection />
        </VisibleSection>
        
        <VisibleSection sectionKey="home_cta">
          <CTASection />
        </VisibleSection>
        
        <VisibleSection sectionKey="global_footer">
          <Footer />
        </VisibleSection>
      </div>
    </div>
  );
};

export default Index;
