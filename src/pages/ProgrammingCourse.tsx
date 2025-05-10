
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProgrammingCourse = () => {
  const modules = [
    {
      title: "Module 1 : Fondamentaux de la programmation",
      description: "Acquérez les bases solides de la logique de programmation et des structures de données.",
      topics: [
        "Algorithmes et logique",
        "Structures de données fondamentales",
        "Paradigmes de programmation",
        "Tests et débogage"
      ],
      duration: "6 semaines",
      projects: ["Implémentation d'algorithmes de tri", "Création d'une structure de données personnalisée"]
    },
    {
      title: "Module 2 : Développement web moderne",
      description: "Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.",
      topics: [
        "HTML, CSS et JavaScript avancé",
        "Frameworks front-end (React, Vue)",
        "Architecture back-end et APIs",
        "Bases de données relationnelles et NoSQL"
      ],
      duration: "8 semaines",
      projects: ["Application web complète avec authentification", "API RESTful avec base de données"]
    },
    {
      title: "Module 3 : Programmation orientée objet",
      description: "Approfondissez vos connaissances avec les principes de conception logicielle robustes.",
      topics: [
        "Classes, objets et héritage",
        "Principes SOLID",
        "Design patterns",
        "Architecture logicielle"
      ],
      duration: "6 semaines",
      projects: ["Bibliothèque orientée objet", "Refactoring d'une application existante"]
    },
    {
      title: "Module 4 : DevOps et déploiement",
      description: "Découvrez le cycle complet de livraison logicielle et les pratiques modernes.",
      topics: [
        "Intégration et déploiement continus",
        "Conteneurisation avec Docker",
        "Orchestration avec Kubernetes",
        "Monitoring et logging"
      ],
      duration: "4 semaines",
      projects: ["Pipeline CI/CD pour une application", "Déploiement conteneurisé sur le cloud"]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-purple to-academy-blue text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formation Complète en Programmation</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Maîtrisez l'art de la programmation moderne avec notre programme complet axé sur les technologies les plus demandées du marché.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Programme de la formation Programmation</h2>
            
            <div className="space-y-12">
              {modules.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-bold mb-3 text-academy-purple">{module.title}</h3>
                  <p className="text-lg mb-6">{module.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700">Thèmes abordés</h4>
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-academy-blue shrink-0 mr-2 mt-0.5" />
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
                            <CheckCircle2 className="w-5 h-5 text-academy-blue shrink-0 mr-2 mt-0.5" />
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
              <Button asChild className="bg-academy-purple hover:bg-academy-blue text-white font-semibold px-8 py-6 text-lg">
                <Link to="/register">
                  S'inscrire à la formation Programmation <ArrowRight className="ml-2" />
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

export default ProgrammingCourse;
