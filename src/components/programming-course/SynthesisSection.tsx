
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, BookOpen } from 'lucide-react';

const SynthesisSection = () => {
  const synthesisData = [
    {
      title: "Synthèse du Programme - 1ère Année",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      details: [
        "9 modules de formation",
        "10 mois intensifs",
        "Fondamentaux de la programmation",
        "Projet pratique inclus"
      ]
    },
    {
      title: "Synthèse du Programme - 2ème Année", 
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      details: [
        "9 modules de spécialisation",
        "10 mois avancés",
        "Technologies de pointe",
        "Projet final d'application"
      ]
    },
    {
      title: "Synthèse Totale - 2 Ans",
      icon: Clock,
      color: "from-green-500 to-green-600", 
      details: [
        "18 modules au total",
        "20 mois de formation",
        "Formation complète",
        "Expertise professionnelle"
      ]
    }
  ];

  return (
    <section id="synthese" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Synthèse du Programme de Formation</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-purple to-academy-blue mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vue d'ensemble complète de votre parcours de formation en programmation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {synthesisData.map((item, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="group-hover:text-academy-purple transition-colors duration-300">
                    Tableau {index + 1}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  {item.title}
                </h3>
                <ul className="space-y-2">
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SynthesisSection;
