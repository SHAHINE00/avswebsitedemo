
import React from 'react';
import { Code, Database, Smartphone, Shield, Cloud, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const KeyAreasSection = () => {
  const keyAreas = [
    { title: "Programmation Fondamentale", description: "Algorithmes, structures de données et POO", icon: Code, color: "from-blue-500 to-purple-600" },
    { title: "Développement Web", description: "Front-end et back-end modernes", icon: Database, color: "from-purple-500 to-pink-600" },
    { title: "Applications Mobiles", description: "Android et iOS natifs", icon: Smartphone, color: "from-green-500 to-blue-600" },
    { title: "Cybersécurité", description: "Sécurisation des applications", icon: Shield, color: "from-orange-500 to-red-600" },
    { title: "DevOps & Cloud", description: "Déploiement et intégration continue", icon: Cloud, color: "from-teal-500 to-cyan-600" },
    { title: "Développement Jeux", description: "Unity et moteurs de jeu", icon: Gamepad2, color: "from-indigo-500 to-purple-600" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Domaines Clés</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Maîtrisez les compétences essentielles pour exceller dans le développement logiciel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {keyAreas.map((area, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <CardContent className="p-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <area.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-academy-purple transition-colors duration-300">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyAreasSection;
