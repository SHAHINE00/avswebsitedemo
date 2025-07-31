import React from 'react';

const AboutCTASection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-academy-blue to-academy-purple rounded-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez l'Innovation</h2>
          <p className="text-xl mb-8 opacity-90">
            Prêt à transformer votre carrière avec nos formations d'excellence ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/curriculum" 
              className="bg-white text-academy-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir nos formations
            </a>
            <a 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-academy-blue transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTASection;