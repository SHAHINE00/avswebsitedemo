import React from 'react';

const SuccessStatsSection: React.FC = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Nos Résultats en Chiffres
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Des statistiques qui parlent d'elles-mêmes
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
            <div className="text-3xl font-bold text-academy-blue">95%</div>
            <div className="text-sm text-gray-600">Taux de réussite</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
            <div className="text-3xl font-bold text-academy-blue">85%</div>
            <div className="text-sm text-gray-600">Insertion en 6 mois</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
            <div className="text-3xl font-bold text-academy-blue">+26</div>
            <div className="text-sm text-gray-600">Spécialisations</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
            <div className="text-3xl font-bold text-academy-blue">200+</div>
            <div className="text-sm text-gray-600">Entreprises partenaires</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStatsSection;