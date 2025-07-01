
import React from 'react';
import { CheckCircle2, ChevronRight, GraduationCap, BookMarked, TestTube, Presentation, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TeachingStrategiesSection = () => {
  const strategies = [
    {
      title: "Apprentissage Pratique",
      description: "Projets concrets et développement d'applications réelles",
      icon: BookMarked,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Méthodologies Agiles",
      description: "Scrum, Kanban et pratiques de développement modernes",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Code Review",
      description: "Révision de code collaborative et bonnes pratiques",
      icon: TestTube,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Présentations Techniques",
      description: "Communication et présentation de solutions techniques",
      icon: Presentation,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const evaluationMethods = [
    "Projets pratiques de développement",
    "Examens techniques et théoriques",
    "Présentation de solutions",
    "Évaluation continue des compétences",
    "Projet final d'application complète"
  ];

  return (
    <section id="strategies" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Stratégies Pédagogiques et Système d'Évaluation</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-purple to-academy-blue mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Méthodes innovantes et évaluation adaptée pour une formation d'excellence en programmation
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Stratégies pédagogiques */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-academy-purple" />
                Stratégies Pédagogiques
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {strategies.map((strategy, index) => (
                  <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${strategy.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <strategy.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-academy-purple transition-colors duration-300">
                        {strategy.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {strategy.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Système d'évaluation */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center">
                <UserCheck className="w-8 h-8 mr-3 text-academy-blue" />
                Système d'Évaluation
              </h3>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Notre système d'évaluation combine théorie et pratique pour une évaluation complète des compétences acquises.
                  </p>
                  <ul className="space-y-4">
                    {evaluationMethods.map((method, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-academy-purple/10 mr-4 mt-0.5 group-hover:bg-academy-purple/20 transition-colors duration-300">
                          <CheckCircle2 className="w-4 h-4 text-academy-purple" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          {method}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-0.5 group-hover:text-academy-purple transition-colors duration-300" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachingStrategiesSection;
