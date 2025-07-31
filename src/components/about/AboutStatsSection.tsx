import React from 'react';

const AboutStatsSection: React.FC = () => {
  const stats = [
    { number: "500+", label: "Étudiants formés" },
    { number: "95%", label: "Taux de satisfaction" },
    { number: "15+", label: "Formateurs experts" },
    { number: "10+", label: "Années d'expérience" }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Nos Réalisations</h2>
          <p className="text-lg text-gray-700">
            Des chiffres qui témoignent de notre engagement et de notre impact.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-academy-blue mb-2">{stat.number}</div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStatsSection;