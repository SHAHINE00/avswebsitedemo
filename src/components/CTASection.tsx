
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Rejoignez l'élite des spécialistes IA au Maroc
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 sm:mb-10 px-4">
            Transformez votre carrière avec notre formation certifiante en Intelligence Artificielle. 
            Rejoignez plus de 500 diplômés qui excellent aujourd'hui dans les plus grandes entreprises.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button asChild className="bg-white text-academy-blue hover:bg-gray-100 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg">
              <Link to="/register">
                S'inscrire maintenant <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg">
              <Link to="/appointment">
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Consultation gratuite
              </Link>
            </Button>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">
              <strong>Prochaine session :</strong> 15 septembre 2025
            </p>
            <p className="text-xs sm:text-sm opacity-90">
              Places limitées • Formation certifiante • Accompagnement personnalisé
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
