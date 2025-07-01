
import React from 'react';
import { BookOpen, Target, Award, Brain, Code, Database, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TableOfContentsSection = () => {
  const tableOfContents = [
    { section: "I", title: "Présentation du Programme de Formation", anchor: "presentation", icon: BookOpen },
    { section: "II", title: "Synthèse du Programme de Formation", anchor: "synthese", icon: Target },
    { section: "III", title: "Buts du Programme de Formation", anchor: "buts", icon: Award },
    { section: "IV", title: "Objectifs Généraux", anchor: "objectifs", icon: Brain },
    { section: "V", title: "Curriculum 1ère Année", anchor: "curriculum", icon: Code },
    { section: "VI", title: "Curriculum 2ème Année", anchor: "curriculum2", icon: Database },
    { section: "IX", title: "Stratégies Pédagogiques et Système d'Évaluation", anchor: "strategies", icon: GraduationCap }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Sommaire du Programme</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez chaque section de notre programme complet
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tableOfContents.map((item, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5 group-hover:from-academy-blue/10 group-hover:to-academy-purple/10 transition-all duration-300"></div>
                <CardContent className="p-0 relative z-10">
                  <a 
                    href={`#${item.anchor}`} 
                    className="block p-8 h-full"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-academy-blue to-academy-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-academy-blue to-academy-purple text-white font-bold text-sm mr-3">
                            {item.section}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">SECTION</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-academy-blue transition-colors duration-300 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-academy-blue transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TableOfContentsSection;
