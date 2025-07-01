
import React from 'react';
import StatsSection from './curriculum/StatsSection';
import FormationCards from './curriculum/FormationCards';
import CTABottomSection from './curriculum/CTABottomSection';

const CurriculumSection: React.FC = () => {
  return (
    <section id="curriculum" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Nos Formations Professionnelles</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez votre parcours et maîtrisez les technologies d'avenir
          </p>
        </div>

        {/* Quick Stats */}
        <StatsSection />
        
        {/* Formation Cards */}
        <FormationCards />

        {/* Bottom CTA */}
        <CTABottomSection />
      </div>
    </section>
  );
};

export default CurriculumSection;
