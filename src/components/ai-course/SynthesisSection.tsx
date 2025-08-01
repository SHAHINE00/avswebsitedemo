
import React from 'react';
import { Calendar, Star, Award, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SynthesisSection = () => {
  return (
    <section id="synthese" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">Synthèse du Programme de Formation</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Un programme structuré sur 2 années pour une expertise complète en Intelligence Artificielle
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {/* Program Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">1ère Année</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-bold text-academy-blue">14</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-bold text-academy-blue">10 mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Focus</span>
                    <span className="font-bold text-academy-blue">Fondamentaux</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Bases techniques, mathématiques, programmation Python et introduction au ML
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 group-hover:from-purple-500/20 group-hover:to-pink-600/20 transition-all duration-300"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">2ème Année</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-bold text-academy-purple">13</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-bold text-academy-purple">10 mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Focus</span>
                    <span className="font-bold text-academy-purple">Spécialisation</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Deep Learning, NLP, Computer Vision, déploiement et projets avancés
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 group-hover:from-emerald-500/20 group-hover:to-teal-600/20 transition-all duration-300"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Programme Total</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-bold text-emerald-600">27</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-bold text-emerald-600">20 mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Niveau</span>
                    <span className="font-bold text-emerald-600">Expert</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Formation complète du débutant à l'expert en Intelligence Artificielle
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Program Timeline */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 lg:p-12">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">Progression Pédagogique</h3>
            
            {/* Mobile-first vertical timeline */}
            <div className="space-y-8 md:space-y-12">
              {/* Year 1 */}
              <div className="flex flex-col md:flex-row md:items-center relative">
                {/* Mobile timeline dot */}
                <div className="flex md:hidden items-center mb-4">
                  <div className="w-4 h-4 bg-academy-blue rounded-full mr-4"></div>
                  <div className="h-px bg-gradient-to-r from-academy-blue to-transparent flex-1"></div>
                </div>
                
                {/* Desktop layout */}
                <div className="hidden md:flex md:flex-1 md:pr-8 md:text-right md:justify-end">
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg max-w-md">
                    <CardContent className="p-4 md:p-6">
                      <h4 className="text-lg md:text-xl font-bold text-academy-blue mb-2">Première Année</h4>
                      <p className="text-gray-700 mb-3 text-sm md:text-base">Fondamentaux et bases techniques</p>
                      <div className="flex items-center justify-end space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-academy-blue" />
                          <span>10 mois</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1 text-academy-blue" />
                          <span>14 modules</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Desktop timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-academy-blue rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Content */}
                <div className="md:flex-1 md:pl-8">
                  {/* Mobile card */}
                  <div className="md:hidden mb-4">
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-bold text-academy-blue mb-2">Première Année</h4>
                        <p className="text-gray-700 mb-3 text-sm">Fondamentaux et bases techniques</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-academy-blue" />
                            <span>10 mois</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1 text-academy-blue" />
                            <span>14 modules</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-gray-600 md:text-left">
                    <p className="text-sm leading-relaxed">
                      • Mathématiques pour l'IA<br/>
                      • Programmation Python avancée<br/>
                      • Introduction au Machine Learning<br/>
                      • Gestion et visualisation de données
                    </p>
                  </div>
                </div>
              </div>

              {/* Year 2 */}
              <div className="flex flex-col md:flex-row md:items-center relative">
                {/* Mobile timeline dot */}
                <div className="flex md:hidden items-center mb-4">
                  <div className="w-4 h-4 bg-academy-purple rounded-full mr-4"></div>
                  <div className="h-px bg-gradient-to-r from-academy-purple to-transparent flex-1"></div>
                </div>
                
                {/* Desktop layout - content first for year 2 */}
                <div className="md:flex-1 md:pr-8 order-2 md:order-1">
                  {/* Mobile card */}
                  <div className="md:hidden mb-4">
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-bold text-academy-purple mb-2">Deuxième Année</h4>
                        <p className="text-gray-700 mb-3 text-sm">Spécialisation et expertise avancée</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-academy-purple" />
                            <span>10 mois</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1 text-academy-purple" />
                            <span>13 modules</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-gray-600 hidden md:block text-right">
                    <p className="text-sm leading-relaxed">
                      • Deep Learning et réseaux de neurones<br/>
                      • NLP et Computer Vision<br/>
                      • Déploiement cloud et production<br/>
                      • Projet de fin d'études
                    </p>
                  </div>
                  
                  {/* Mobile content */}
                  <div className="text-gray-600 md:hidden">
                    <p className="text-sm leading-relaxed">
                      • Deep Learning et réseaux de neurones<br/>
                      • NLP et Computer Vision<br/>
                      • Déploiement cloud et production<br/>
                      • Projet de fin d'études
                    </p>
                  </div>
                </div>
                
                {/* Desktop timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-academy-purple rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Desktop card */}
                <div className="hidden md:flex md:flex-1 md:pl-8 order-1 md:order-2">
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg max-w-md">
                    <CardContent className="p-4 md:p-6">
                      <h4 className="text-lg md:text-xl font-bold text-academy-purple mb-2">Deuxième Année</h4>
                      <p className="text-gray-700 mb-3 text-sm md:text-base">Spécialisation et expertise avancée</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-academy-purple" />
                          <span>10 mois</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1 text-academy-purple" />
                          <span>13 modules</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SynthesisSection;
