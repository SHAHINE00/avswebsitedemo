
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CurriculumSection from '@/components/CurriculumSection';
import InstructorsSection from '@/components/InstructorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CurriculumSection />
      <InstructorsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/elementor-export" 
          className="bg-academy-purple text-white px-4 py-2 rounded-full shadow-lg hover:bg-academy-blue transition-colors"
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
