
import React from 'react';
import { CheckCircle2, ChevronRight, GraduationCap, BookMarked, TestTube, Presentation, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TeachingStrategiesSection = () => {
  const teachingStrategies = [
    {
      title: "Approches Pédagogiques",
      icon: BookMarked,
      color: "from-blue-500 to-indigo-600",
      content: "Notre approche combine cours magistraux, travaux pratiques, projets en équipe et stages en entreprise. L'accent est mis sur l'apprentissage par la pratique avec des projets concrets utilisant des données réelles.",
      features: ["Cours magistraux interactifs", "Travaux pratiques intensifs", "Projets collaboratifs", "Stages en entreprise"]
    },
    {
      title: "Système d'Évaluation",
      icon: TestTube,
      color: "from-purple-500 to-pink-600",
      content: "L'évaluation se base sur un contrôle continu incluant des examens théoriques, des projets pratiques, des présentations orales et un projet de fin d'études. Chaque module est évalué selon des critères spécifiques adaptés à ses objectifs pédagogiques.",
      features: ["Contrôle continu", "Examens théoriques", "Projets pratiques", "Évaluations orales"]
    },
    {
      title: "Outils & Technologies",
      icon: Presentation,
      color: "from-emerald-500 to-cyan-600",
      content: "Utilisation d'environnements de développement modernes, plateformes cloud, et outils collaboratifs pour simuler les conditions réelles de travail en entreprise.",
      features: ["Environnements cloud", "Outils collaboratifs", "Plateformes modernes", "Simulation entreprise"]
    },
    {
      title: "Suivi Personnalisé",
      icon: UserCheck,
      color: "from-orange-500 to-red-600",
      content: "Accompagnement individualisé avec mentoring, suivi de progression, et support adapté aux besoins spécifiques de chaque apprenant.",
      features: ["Mentoring individuel", "Suivi personnalisé", "Support adaptatif", "Coaching carrière"]
    }
  ];

  return (
    <section id="strategies" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Stratégies Pédagogiques et Système d'Évaluation</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Méthodes innovantes et évaluation adaptée pour une formation d'excellence
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teachingStrategies.map((strategy, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${strategy.color} flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <strategy.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-academy-blue transition-colors duration-300">
                      {strategy.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {strategy.content}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-academy-blue mr-2" />
                      Caractéristiques
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {strategy.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <ChevronRight className="w-4 h-4 text-academy-blue mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Additional Info Section */}
          <div className="mt-12">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-8 text-white">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-6">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">Excellence Pédagogique</h3>
                </div>
                <p className="text-xl text-center opacity-90 max-w-4xl mx-auto leading-relaxed">
                  Notre approche pédagogique unique combine innovation technologique et accompagnement personnalisé 
                  pour garantir le succès de chaque apprenant dans son parcours vers l'expertise en IA.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachingStrategiesSection;
