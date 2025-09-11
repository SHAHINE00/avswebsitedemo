import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Megaphone, TrendingUp, ArrowRight } from 'lucide-react';

const CareerPaths: React.FC = () => {
  console.log('🎯 CareerPaths component is rendering!');
  return (
    <section 
      className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-academy-gray/30"
      style={{ 
        minHeight: '400px',
        border: '3px solid red',
        backgroundColor: 'yellow'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 gradient-text">Opportunités de Carrière</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Découvrez des carrières passionnantes dans nos 3 spécialités de formation
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-academy-blue">85%</div>
              <div className="text-xs text-gray-500">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-academy-purple">€52k</div>
              <div className="text-xs text-gray-500">Salaire moyen</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-academy-lightblue">25%</div>
              <div className="text-xs text-gray-500">Croissance</div>
            </div>
          </div>
          
          {/* Career Cards - Aligned with Formation Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* AI & Data Science Career */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-academy-blue/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 h-2 bg-academy-blue rounded-full animate-pulse"></div>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-academy-blue/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                  <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-academy-blue" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-academy-blue">IA & Data Science</h3>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Data Scientist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Ingénieur ML/IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Architecte IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Analyste BI</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-academy-blue/10 text-academy-blue rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                  €45k - €85k
                </div>
                <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
              </div>
            </div>
            
            {/* Programming & Infrastructure Career */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-academy-purple/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 h-2 bg-academy-purple rounded-full animate-pulse"></div>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-academy-purple/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                  <Code className="w-4 sm:w-5 h-4 sm:h-5 text-academy-purple" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-academy-purple">Programmation & Infrastructure</h3>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-purple rounded-full mr-2"></div>
                  <span>Développeur Full Stack</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-purple rounded-full mr-2"></div>
                  <span>Développeur Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-purple rounded-full mr-2"></div>
                  <span>Ingénieur DevOps</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-purple rounded-full mr-2"></div>
                  <span>Architecte Cloud</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-academy-purple/10 text-academy-purple rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                  €40k - €75k
                </div>
                <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
              </div>
            </div>

            {/* Marketing Digital & Créatif */}
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-academy-lightblue/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 h-2 bg-academy-lightblue rounded-full animate-pulse"></div>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="bg-academy-lightblue/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                  <Megaphone className="w-4 sm:w-5 h-4 sm:h-5 text-academy-lightblue" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-academy-lightblue">Marketing Digital & Créatif</h3>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-lightblue rounded-full mr-2"></div>
                  <span>Marketing Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-lightblue rounded-full mr-2"></div>
                  <span>Community Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-lightblue rounded-full mr-2"></div>
                  <span>Content Creator</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-lightblue rounded-full mr-2"></div>
                  <span>E-commerce Specialist</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-academy-lightblue/10 text-academy-lightblue rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                  €35k - €65k
                </div>
                <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-academy-blue hover:bg-academy-purple text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all group">
              <Link to="/careers" className="flex items-center">
                Voir toutes les opportunités
                <ArrowRight className="ml-2 w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;