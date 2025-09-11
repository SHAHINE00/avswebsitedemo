import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Send, TrendingUp, ArrowRight } from 'lucide-react';

const CareerPaths: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Opportunités de Carrière
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Découvrez des carrières passionnantes dans nos 3 spécialités de formation
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center gap-16 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-700 mb-2">€52k</div>
              <div className="text-gray-600">Salaire moyen</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-500 mb-2">25%</div>
              <div className="text-gray-600">Croissance</div>
            </div>
          </div>
          
          {/* Career Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* IA & Data Science */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-700">IA & Data Science</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Data Scientist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Ingénieur ML/IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Architecte IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Analyste BI</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 font-semibold">
                  €45k - €85k
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            
            {/* Programmation & Infrastructure */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <Code className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700">Programmation & Infrastructure</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Développeur Full Stack</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Développeur Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Ingénieur DevOps</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Architecte Cloud</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-semibold">
                  €40k - €75k
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Marketing Digital & Créatif */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-600">Marketing Digital & Créatif</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Marketing Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Community Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">Content Creator</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700">E-commerce Specialist</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-cyan-100 text-cyan-600 rounded-full px-4 py-2 font-semibold">
                  €35k - €65k
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold">
              <Link to="/careers" className="flex items-center">
                Voir toutes les opportunités
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;