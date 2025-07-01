
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, ArrowRight, Clock, Users, Award, Brain, Calculator, Database, Cloud, Gavel, Target, Star, TrendingUp } from 'lucide-react';

const CurriculumSection: React.FC = () => {
  return (
    <section id="curriculum" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Nos Formations Professionnelles</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez votre parcours et maîtrisez les technologies d'avenir
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-academy-blue">18</div>
            <div className="text-sm text-gray-500">mois de formation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-academy-purple">95%</div>
            <div className="text-sm text-gray-500">taux de réussite</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-academy-lightblue">500+</div>
            <div className="text-sm text-gray-500">diplômés</div>
          </div>
        </div>
        
        {/* Formation Cards - Compact Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
          {/* Formation IA */}
          <div className="group relative overflow-hidden">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-academy-blue to-academy-purple rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Formation IA</h3>
                    <p className="text-sm opacity-90">Intelligence Artificielle</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medium">27 modules</span>
                </div>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 opacity-75" />
                  <span>18 mois</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 opacity-75" />
                  <span>Diplôme certifié</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 opacity-75" />
                  <span>Machine Learning</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 opacity-75" />
                  <span>Big Data</span>
                </div>
              </div>

              {/* CTA */}
              <Button asChild className="w-full bg-white text-academy-blue hover:bg-gray-100 font-semibold rounded-xl transition-all group-hover:shadow-lg">
                <Link to="/ai-course">
                  Découvrir le programme
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-academy-lightblue/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          </div>
          
          {/* Formation Programmation */}
          <div className="group relative overflow-hidden">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-academy-purple to-academy-lightblue rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Formation Programmation</h3>
                    <p className="text-sm opacity-90">Développement Web & Mobile</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medium">4 modules</span>
                </div>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 opacity-75" />
                  <span>24 semaines</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 opacity-75" />
                  <span>Diplôme certifié</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-2 opacity-75" />
                  <span>Full Stack</span>
                </div>
                <div className="flex items-center">
                  <Cloud className="w-4 h-4 mr-2 opacity-75" />
                  <span>DevOps</span>
                </div>
              </div>

              {/* CTA */}
              <Button asChild className="w-full bg-white text-academy-purple hover:bg-gray-100 font-semibold rounded-xl transition-all group-hover:shadow-lg">
                <Link to="/programming-course">
                  Découvrir le programme
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-2 -left-2 w-12 h-12 bg-academy-blue/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-academy-gray to-white rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Star className="w-5 h-5 text-academy-blue mr-2" />
              <h3 className="text-xl font-bold text-gray-800">Transformez votre carrière</h3>
              <Star className="w-5 h-5 text-academy-purple ml-2" />
            </div>
            <p className="text-gray-600 mb-4 max-w-xl mx-auto">
              Rejoignez des centaines d'étudiants qui ont choisi l'excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-6 py-2">
                <Link to="/register">S'inscrire maintenant</Link>
              </Button>
              <Button asChild variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-6 py-2">
                <Link to="/contact">Plus d'informations</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
