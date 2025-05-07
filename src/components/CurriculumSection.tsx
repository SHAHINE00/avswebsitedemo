
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const modules = [
  {
    title: "Module 1 : Introduction à l'AI",
    description: "Comprenez les bases, l'historique et les applications actuelles de l'intelligence artificielle.",
    topics: [
      "Historique et évolution de l'AI",
      "AI faible vs AI générale",
      "Applications clés dans l'industrie",
      "Enjeux éthiques en AI"
    ]
  },
  {
    title: "Module 2 : Fondamentaux du Machine Learning",
    description: "Maîtrisez les principes fondamentaux des algorithmes d'apprentissage automatique et leurs usages.",
    topics: [
      "Apprentissage supervisé et non supervisé",
      "Régression et classification",
      "Évaluation et validation des modèles",
      "Ingénierie et sélection des caractéristiques"
    ]
  },
  {
    title: "Module 3 : Deep Learning & Réseaux de neurones",
    description: "Découvrez la structure et l'utilisation avancée des réseaux de neurones dans la résolution de problèmes complexes.",
    topics: [
      "Architecture des réseaux neuronaux",
      "Réseaux convolutifs",
      "Réseaux récurrents",
      "Transfert de connaissances et fine tuning"
    ]
  },
  {
    title: "Module 4 : Déploiement des systèmes AI",
    description: "Apprenez à déployer, maintenir et optimiser des systèmes AI en environnement réel.",
    topics: [
      "Bonnes pratiques de déploiement",
      "Optimisation performance & passage à l'échelle",
      "Supervision continue",
      "Systèmes auto-apprenants"
    ]
  }
];

const CurriculumSection: React.FC = () => {
  return (
    <section id="curriculum" className="py-20 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Parcours pédagogique complet</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Un chemin structuré : de l'initiation à l'AI jusqu'à la maîtrise pratique, pour faire de vous un expert terrain.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-academy-blue">{module.title}</h3>
              <p className="text-gray-700 mb-4">{module.description}</p>
              <ul className="space-y-2 mb-5">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
            Voir le programme complet
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
