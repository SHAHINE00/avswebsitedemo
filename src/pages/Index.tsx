
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
import { pageSEO } from '@/utils/seoData';

const Index = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <SEOHead {...pageSEO.home} />
      <Navbar />
      <div style={{ paddingTop: '5rem' }}>
        <HeroSection />
        <FeaturesSection />
        <EnhancedCourseSelectionGuide />
        <InstructorsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
      
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/elementor-export" 
          className="bg-academy-purple text-white px-4 py-2 rounded-xl shadow-lg hover:bg-academy-blue transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          WordPress Export Guide
        </a>
      </div>
    </div>
  );
};

export default Index;
