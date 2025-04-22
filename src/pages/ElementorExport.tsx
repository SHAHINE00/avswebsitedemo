
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CurriculumSection from '@/components/CurriculumSection';
import InstructorsSection from '@/components/InstructorsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const ElementorExport = () => {
  return (
    <div className="min-h-screen bg-white">
      <div id="navbar-section" className="elementor-section">
        <Navbar />
      </div>
      <div id="hero-section" className="elementor-section">
        <HeroSection />
      </div>
      <div id="features-section" className="elementor-section">
        <FeaturesSection />
      </div>
      <div id="curriculum-section" className="elementor-section">
        <CurriculumSection />
      </div>
      <div id="instructors-section" className="elementor-section">
        <InstructorsSection />
      </div>
      <div id="testimonials-section" className="elementor-section">
        <TestimonialsSection />
      </div>
      <div id="cta-section" className="elementor-section">
        <CTASection />
      </div>
      <div id="footer-section" className="elementor-section">
        <Footer />
      </div>
    </div>
  );
};

export default ElementorExport;
