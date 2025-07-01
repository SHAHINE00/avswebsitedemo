
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Rocket, TrendingUp } from 'lucide-react';

const CareerPaths: React.FC = () => {
  return (
    <section className="career-opportunities">
      <div className="container mx-auto px-6 py-16 bg-gradient-to-b from-white to-academy-gray/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Opportunités de Carrière</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Découvrez des carrières passionnantes en IA et Programmation dans des secteurs en croissance de <strong>25% par an</strong>
            </p>
          </div>
          
          {/* Statistics */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-academy-blue">85%</div>
              <div className="text-sm text-gray-600">Taux de placement</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-academy-purple">€45k+</div>
              <div className="text-sm text-gray-600">Salaire moyen</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-academy-blue">25%</div>
              <div className="text-sm text-gray-600">Croissance annuelle</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* IA Career Card */}
            <div className="group bg-gradient-to-br from-white to-academy-blue/5 p-8 rounded-2xl shadow-lg border border-academy-blue/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-academy-blue/10 p-3 rounded-xl mr-4">
                  <Brain className="w-8 h-8 text-academy-blue" />
                </div>
                <h3 className="text-2xl font-bold text-academy-blue">Intelligence Artificielle</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-blue mr-2" />
                  <span>Data Scientist</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-blue mr-2" />
                  <span>Ingénieur Machine Learning</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-blue mr-2" />
                  <span>Architecte Solutions IA</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Créez des systèmes intelligents qui transforment les industries de la santé, finance et automobile.
              </p>
              
              <div className="bg-academy-blue/10 text-academy-blue rounded-lg px-3 py-1 text-sm inline-block">
                Secteur en forte demande
              </div>
            </div>
            
            {/* Programming Career Card */}
            <div className="group bg-gradient-to-br from-white to-academy-purple/5 p-8 rounded-2xl shadow-lg border border-academy-purple/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-academy-purple/10 p-3 rounded-xl mr-4">
                  <Code className="w-8 h-8 text-academy-purple" />
                </div>
                <h3 className="text-2xl font-bold text-academy-purple">Programmation</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-purple mr-2" />
                  <span>Développeur Full Stack</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-purple mr-2" />
                  <span>Développeur Mobile</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <TrendingUp className="w-4 h-4 text-academy-purple mr-2" />
                  <span>Ingénieur DevOps</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Développez des applications web et mobile qui révolutionnent l'expérience utilisateur.
              </p>
              
              <div className="bg-academy-purple/10 text-academy-purple rounded-lg px-3 py-1 text-sm inline-block">
                Opportunités globales
              </div>
            </div>
          </div>

          {/* Entrepreneurship Section */}
          <div className="bg-gradient-to-r from-academy-purple via-academy-blue to-academy-lightblue p-8 rounded-2xl text-white text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Créez Votre Startup Tech</h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Lancez votre propre entreprise avec nos formations et rejoignez l'écosystème entrepreneurial technologique.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 rounded-lg p-3 text-sm">Applications IA</div>
              <div className="bg-white/10 rounded-lg p-3 text-sm">Plateformes Web</div>
              <div className="bg-white/10 rounded-lg p-3 text-sm">Solutions Cloud</div>
              <div className="bg-white/10 rounded-lg p-3 text-sm">Outils Automation</div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-academy-blue hover:bg-academy-purple text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Link to="/careers">
                Voir toutes les opportunités
              </Link>
            </Button>
            <p className="text-gray-600 mt-3">Découvrez les détails des carrières et postes disponibles</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;
