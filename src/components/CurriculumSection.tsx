
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const aiModules = [
  {
    title: "Module 1 : Introduction à l'IA",
    description: "Comprenez les bases, l'historique et les applications actuelles de l'intelligence artificielle.",
    topics: [
      "Historique et évolution de l'IA",
      "IA faible vs IA générale",
      "Applications clés dans l'industrie",
      "Enjeux éthiques en IA"
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
    title: "Module 4 : Déploiement des systèmes IA",
    description: "Apprenez à déployer, maintenir et optimiser des systèmes IA en environnement réel.",
    topics: [
      "Bonnes pratiques de déploiement",
      "Optimisation performance & passage à l'échelle",
      "Supervision continue",
      "Systèmes auto-apprenants"
    ]
  }
];

const programmingModules = [
  {
    title: "Module 1 : Fondamentaux de la programmation",
    description: "Acquérez les bases solides de la logique de programmation et des structures de données.",
    topics: [
      "Algorithmes et logique",
      "Structures de données fondamentales",
      "Paradigmes de programmation",
      "Tests et débogage"
    ]
  },
  {
    title: "Module 2 : Développement web moderne",
    description: "Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.",
    topics: [
      "HTML, CSS et JavaScript avancé",
      "Frameworks front-end (React, Vue)",
      "Architecture back-end et APIs",
      "Bases de données relationnelles et NoSQL"
    ]
  },
  {
    title: "Module 3 : Programmation orientée objet",
    description: "Approfondissez vos connaissances avec les principes de conception logicielle robustes.",
    topics: [
      "Classes, objets et héritage",
      "Principes SOLID",
      "Design patterns",
      "Architecture logicielle"
    ]
  },
  {
    title: "Module 4 : DevOps et déploiement",
    description: "Découvrez le cycle complet de livraison logicielle et les pratiques modernes.",
    topics: [
      "Intégration et déploiement continus",
      "Conteneurisation avec Docker",
      "Orchestration avec Kubernetes",
      "Monitoring et logging"
    ]
  }
];

const CurriculumSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ai");
  
  return (
    <section id="curriculum" className="py-12 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Parcours pédagogiques complets</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Des chemins structurés : de l'initiation jusqu'à la maîtrise pratique, pour faire de vous un expert dans votre domaine.
          </p>
        </div>
        
        <div className="tab-container mb-8">
          <button 
            className={`tab ${activeTab === "ai" ? "active" : ""}`} 
            onClick={() => setActiveTab("ai")}
          >
            Formation IA
          </button>
          <button 
            className={`tab ${activeTab === "programming" ? "active" : ""}`} 
            onClick={() => setActiveTab("programming")}
          >
            Formation Programmation
          </button>
        </div>
        
        <div className="mt-8">
          {activeTab === "ai" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiModules.map((module, index) => (
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
              <div className="mt-10 text-center">
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                  <Link to="/ai-course">Voir le programme IA complet</Link>
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "programming" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programmingModules.map((module, index) => (
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
              <div className="mt-10 text-center">
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                  <Link to="/programming-course">Voir le programme Programmation complet</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
