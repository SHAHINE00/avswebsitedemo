
import * as React from 'react';
import SpecialtyPillars from './curriculum/SpecialtyPillars';
import CTABottomSection from './curriculum/CTABottomSection';

const CurriculumSection: React.FC = () => {
  return (
    <section id="curriculum" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Nos Spécialités Professionnelles</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos trois piliers d'excellence et choisissez votre parcours de spécialisation
          </p>
        </div>

        {/* Specialty Pillars */}
        <SpecialtyPillars />

        {/* Bottom CTA */}
        <CTABottomSection />
      </div>
    </section>
  );
};

export default CurriculumSection;
