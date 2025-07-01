
import React from 'react';
import { TrendingUp, Users2, Lightbulb, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProgramGoalsSection = () => {
  const programGoals = [
    {
      id: "1",
      title: "Efficacité Professionnelle",
      description: "Rendre la personne efficace dans l'exercice d'une profession.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      details: "Développer les compétences techniques et pratiques nécessaires pour exceller dans le domaine de l'IA"
    },
    {
      id: "2", 
      title: "Intégration Professionnelle",
      description: "Assurer l'intégration de la personne à la vie professionnelle.",
      icon: Users2,
      color: "from-purple-500 to-pink-500",
      details: "Faciliter l'insertion dans les équipes et environnements de travail spécialisés en IA"
    },
    {
      id: "3",
      title: "Évolution des Savoirs",
      description: "Favoriser l'évolution et l'approfondissement des savoirs professionnels.",
      icon: Lightbulb,
      color: "from-emerald-500 to-teal-500",
      details: "Encourager l'apprentissage continu et l'adaptation aux nouvelles technologies"
    },
    {
      id: "4",
      title: "Mobilité Professionnelle",
      description: "Assurer la mobilité professionnelle.",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
      details: "Permettre l'adaptation à différents secteurs et rôles dans l'écosystème IA"
    }
  ];

  return (
    <section id="buts" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Buts du Programme de Formation</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quatre piliers fondamentaux pour votre réussite professionnelle en Intelligence Artificielle
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programGoals.map((goal, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <goal.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center mb-3">
                        <span className="bg-gradient-to-r from-academy-blue to-academy-purple text-white px-3 py-1 rounded-lg text-sm font-bold mr-3">
                          {goal.id}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-academy-blue transition-colors duration-300">
                        {goal.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                        {goal.description}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {goal.details}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramGoalsSection;
