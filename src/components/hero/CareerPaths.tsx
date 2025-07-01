
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Rocket, TrendingUp, ArrowRight } from 'lucide-react';

const CareerPaths: React.FC = () => {
  return (
    <section className="career-opportunities py-12 bg-gradient-to-b from-white to-academy-gray/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 gradient-text">Opportunités de Carrière</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez des carrières passionnantes en IA et Programmation
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-xl font-bold text-academy-blue">85%</div>
              <div className="text-xs text-gray-500">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-academy-purple">€52k</div>
              <div className="text-xs text-gray-500">Salaire moyen</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-academy-lightblue">25%</div>
              <div className="text-xs text-gray-500">Croissance</div>
            </div>
          </div>
          
          {/* Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* AI Career */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-academy-blue/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-4 right-4 w-2 h-2 bg-academy-blue rounded-full animate-pulse"></div>
              <div className="flex items-center mb-4">
                <div className="bg-academy-blue/10 p-2 rounded-lg mr-3">
                  <Brain className="w-5 h-5 text-academy-blue" />
                </div>
                <h3 className="text-lg font-bold text-academy-blue">Intelligence Artificielle</h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Data Scientist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Ingénieur ML</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-academy-blue rounded-full mr-2"></div>
                  <span>Architecte IA</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-academy-blue/10 text-academy-blue rounded-full px-3 py-1 text-xs font-medium">
                  €45k - €85k
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
            
            {/* Programming Career */}
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-academy-purple/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-4 right-4 w-2 h-2 bg-academy-purple rounded-full animate-pulse"></div>
              <div className="flex items-center mb-4">
                <div className="bg-academy-purple/10 p-2 rounded-lg mr-3">
                  <Code className="w-5 h-5 text-academy-purple" />
                </div>
                <h3 className="text-lg font-bold text-academy-purple">Programmation</h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
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
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-academy-purple/10 text-academy-purple rounded-full px-3 py-1 text-xs font-medium">
                  €40k - €75k
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>

            {/* Entrepreneurship */}
            <div className="group relative bg-gradient-to-br from-academy-lightblue to-academy-blue rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="flex items-center mb-4">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">Entrepreneuriat</h3>
              </div>
              
              <div className="space-y-2 text-sm mb-4 opacity-90">
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-white rounded-full mr-2"></div>
                  <span>Startup IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-white rounded-full mr-2"></div>
                  <span>App Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1 h-1 bg-white rounded-full mr-2"></div>
                  <span>Plateforme SaaS</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-white/20 text-white rounded-full px-3 py-1 text-xs font-medium">
                  Potentiel illimité
                </div>
                <Rocket className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-academy-blue hover:bg-academy-purple text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group">
              <Link to="/careers" className="flex items-center">
                Voir toutes les opportunités
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;
