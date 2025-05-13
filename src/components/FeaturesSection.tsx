
import React from 'react';
import { Brain, Book, Monitor, Award, Clock, Network } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-10 h-10 text-academy-blue" />,
    title: "Fondamentaux de l'IA",
    description: "Découvrez les concepts et mathématiques essentiels derrière le machine learning et l'intelligence artificielle."
  },
  {
    icon: <Monitor className="w-10 h-10 text-academy-blue" />,
    title: "Projets Pratiques",
    description: "Réalisez des applications d'IA concrètes et étoffez votre portfolio grâce à des projets guidés."
  },
  {
    icon: <Award className="w-10 h-10 text-academy-blue" />,
    title: "Certification Reconnu",
    description: "Obtenez une certification reconnue validant vos compétences auprès des employeurs."
  },
  {
    icon: <Book className="w-10 h-10 text-academy-blue" />,
    title: "Programme Complet",
    description: "Le cursus couvre de la base des algorithmes d'IA jusqu'aux réseaux neuronaux avancés."
  },
  {
    icon: <Network className="w-10 h-10 text-academy-blue" />,
    title: "Réseautage",
    description: "Échangez avec des professionnels du secteur et d'autres apprenants dans notre communauté."
  },
  {
    icon: <Clock className="w-10 h-10 text-academy-blue" />,
    title: "Flexibilité",
    description: "Apprenez à votre rythme avec un accès à vie aux supports et mises à jour régulières."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir notre formation en IA ?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Notre programme complet vous transforme débutant en spécialiste IA du secteur à travers des projets concrets et l'accompagnement d'experts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white p-6 rounded-lg border border-gray-200 hover:border-academy-blue transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
