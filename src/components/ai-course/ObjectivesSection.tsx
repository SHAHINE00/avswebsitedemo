
import React from 'react';
import { Brain, CheckCircle2, ChevronRight, Code, Building2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ObjectivesSection = () => {
  return (
    <section id="objectifs" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Objectifs Généraux</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une vision complète pour former les experts IA de demain
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5 group-hover:from-academy-blue/10 group-hover:to-academy-purple/10 transition-all duration-300"></div>
            <CardContent className="p-0 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left side - Main content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-academy-blue to-academy-purple flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Expertise Complète</h3>
                      <p className="text-academy-blue font-medium">Formation intégrée et professionnalisante</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Le programme vise à développer chez les apprenants une <strong>expertise complète en intelligence artificielle</strong>, 
                      combinant les aspects théoriques fondamentaux et les applications pratiques.
                    </p>
                    
                    <div className="bg-white/50 rounded-xl p-6 mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircle2 className="w-6 h-6 text-academy-blue mr-3" />
                        Compétences Clés
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                          <span>Maîtrise des algorithmes d'apprentissage automatique</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                          <span>Capacité à traiter et analyser des données complexes</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                          <span>Compréhension des enjeux éthiques et légaux de l'IA</span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                          <span>Développement de compétences en déploiement et maintenance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Visual elements */}
                <div className="bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Théorie + Pratique</h4>
                          <p className="text-sm text-gray-600">Équilibre parfait</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Combinaison optimale entre fondements théoriques solides et applications pratiques concrètes.</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Environnement Pro</h4>
                          <p className="text-sm text-gray-600">Conditions réelles</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Formation dans des conditions similaires à l'environnement professionnel réel.</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mr-4">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Éthique & Légal</h4>
                          <p className="text-sm text-gray-600">Responsabilité</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Formation aux enjeux éthiques et aux responsabilités légales en IA.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
