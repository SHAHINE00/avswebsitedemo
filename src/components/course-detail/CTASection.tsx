import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Clock, Award } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à Transformer Votre Carrière ?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Rejoignez notre programme d'excellence et développez les compétences 
              les plus recherchées du marché
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Accompagnement Expert</h3>
                <p className="text-white/80 text-sm">Formateurs expérimentés et mentoring personnalisé</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Formation Intensive</h3>
                <p className="text-white/80 text-sm">Programme optimisé pour une montée en compétences rapide</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Attestation de Compétences</h3>
                <p className="text-white/80 text-sm">Diplôme valorisé par les entreprises du secteur</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                S'inscrire maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-300"
              >
                Demander des informations
              </Link>
            </div>

            <p className="text-white/80 text-sm">
              Places limitées • Inscription ouverte • Financement possible
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;