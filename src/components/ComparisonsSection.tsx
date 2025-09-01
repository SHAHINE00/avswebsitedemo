import React from 'react';
import ComparisonTable from '@/components/ComparisonTable';

const ComparisonsSection: React.FC = () => {
  // Comparison data
  const comparisonData = {
    title: "AVS INSTITUTE vs Formations Traditionnelles",
    subtitle: "Pourquoi choisir AVS pour votre formation tech ?",
    columns: ["AVS INSTITUTE", "Universités Publiques", "Formations Privées"],
    rows: [
      {
        feature: "Durée de formation",
        values: ["1.5-20 mois", "3-5 ans", "1-2 ans"]
      },
      {
        feature: "Certifications internationales",
        values: [true, false, false]
      },
      {
        feature: "Projets pratiques",
        values: [true, false, true]
      },
      {
        feature: "Accompagnement emploi",
        values: [true, false, false]
      },
      {
        feature: "Formateurs professionnels actifs",
        values: [true, false, true]
      },
      {
        feature: "Accès plateforme 24/7",
        values: [true, false, false]
      },
      {
        feature: "Tarif moyen",
        values: ["3-29k MAD", "Gratuit*", "50-80k MAD"]
      },
      {
        feature: "Taux d'insertion professionnelle",
        values: ["85%", "45%", "65%"]
      }
    ]
  };

  // Salary data for Morocco
  const salaryData = {
    title: "Salaires Moyens au Maroc après Formation AVS",
    subtitle: "Données basées sur nos diplômés des 3 dernières années",
    columns: ["Débutant", "2-3 ans d'exp.", "5+ ans d'exp."],
    rows: [
      {
        feature: "Data Scientist",
        values: ["15 000 MAD", "22 000 MAD", "35 000 MAD"]
      },
      {
        feature: "Développeur Full Stack",
        values: ["12 000 MAD", "18 000 MAD", "28 000 MAD"]
      },
      {
        feature: "Expert Cybersécurité",
        values: ["14 000 MAD", "25 000 MAD", "40 000 MAD"]
      },
      {
        feature: "DevOps Engineer",
        values: ["16 000 MAD", "24 000 MAD", "35 000 MAD"]
      },
      {
        feature: "Chef de Projet IA",
        values: ["18 000 MAD", "28 000 MAD", "45 000 MAD"]
      }
    ]
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
            Comparaisons et Données Clés
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez pourquoi AVS INSTITUTE est le meilleur choix pour votre formation tech au Maroc
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-8 mb-8">
          <ComparisonTable {...comparisonData} />
        </div>
        
        <div className="grid md:grid-cols-1 gap-8">
          <ComparisonTable {...salaryData} />
        </div>
      </div>
    </section>
  );
};

export default ComparisonsSection;