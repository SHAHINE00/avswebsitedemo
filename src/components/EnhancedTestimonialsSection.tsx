import React from 'react';
import TestimonialsSection from '@/components/TestimonialsSection';

const EnhancedTestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            🌟 Témoignages de nos Alumni
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Plus de 3000 diplômés ont transformé leur carrière avec AVS INSTITUTE
          </p>
        </div>
        
        <TestimonialsSection />
      </div>
    </section>
  );
};

export default EnhancedTestimonialsSection;