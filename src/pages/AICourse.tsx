
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AICourse = () => {
  const modules = [
    {
      title: "Module 1 : Introduction à l'AI",
      description: "Comprenez les bases, l'historique et les applications actuelles de l'intelligence artificielle.",
      topics: [
        "Historique et évolution de l'AI",
        "AI faible vs AI générale",
        "Applications clés dans l'industrie",
        "Enjeux éthiques en AI"
      ],
      duration: "4 semaines",
      projects: ["Analyse d'impact de l'AI dans une industrie spécifique", "Cartographie des solutions AI existantes"]
    },
    {
      title: "Module 2 : Fondamentaux du Machine Learning",
      description: "Maîtrisez les principes fondamentaux des algorithmes d'apprentissage automatique et leurs usages.",
      topics: [
        "Apprentissage supervisé et non supervisé",
        "Régression et classification",
        "Évaluation et validation des modèles",
        "Ingénierie et sélection des caractéristiques"
      ],
      duration: "6 semaines",
      projects: ["Prédiction de données avec des modèles de régression", "Système de classification d'images"]
    },
    {
      title: "Module 3 : Deep Learning & Réseaux de neurones",
      description: "Découvrez la structure et l'utilisation avancée des réseaux de neurones dans la résolution de problèmes complexes.",
      topics: [
        "Architecture des réseaux neuronaux",
        "Réseaux convolutifs",
        "Réseaux récurrents",
        "Transfert de connaissances et fine tuning"
      ],
      duration: "8 semaines",
      projects: ["Système de reconnaissance d'objets", "Modèle de génération de texte"]
    },
    {
      title: "Module 4 : Déploiement des systèmes AI",
      description: "Apprenez à déployer, maintenir et optimiser des systèmes AI en environnement réel.",
      topics: [
        "Bonnes pratiques de déploiement",
        "Optimisation performance & passage à l'échelle",
        "Supervision continue",
        "Systèmes auto-apprenants"
      ],
      duration: "6 semaines",
      projects: ["Déploiement d'une API pour un modèle de prédiction", "Mise en place d'un système de monitoring"]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formation Complète en Intelligence Artificielle</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Devenez un expert en intelligence artificielle grâce à notre programme complet combinant théorie et pratique sur les technologies AI de pointe.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Programme de la formation AI</h2>
            
            <div className="space-y-12">
              {modules.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold mb-3 text-academy-blue">{module.title}</h3>
                  <p className="text-lg mb-6">{module.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700">Thèmes abordés</h4>
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700">Durée</h4>
                      <p>{module.duration}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700">Projets</h4>
                      <ul className="space-y-2">
                        {module.projects.map((project, projectIndex) => (
                          <li key={projectIndex} className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                            <span>{project}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                <Link to="/register">
                  S'inscrire à la formation AI <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourse;
