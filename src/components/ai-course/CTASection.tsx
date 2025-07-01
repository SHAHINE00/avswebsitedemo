
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-academy-blue via-academy-purple to-academy-lightblue text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Rejoignez l'Excellence</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à Transformer
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Votre Carrière ?
            </span>
          </h3>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Rejoignez notre programme d'excellence et devenez un expert recherché en Intelligence Artificielle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-academy-blue hover:bg-gray-100 font-bold px-10 py-6 text-lg rounded-xl shadow-2xl">
              <Link to="/register">
                S'inscrire maintenant <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-academy-blue font-bold px-10 py-6 text-lg rounded-xl">
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
