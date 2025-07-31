
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AdvantageBadges from './AdvantageBadges';

const HeroBanner: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[80vh] flex flex-col items-center justify-center pt-6">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Patterns */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-br from-academy-blue/20 to-academy-purple/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-gradient-to-br from-academy-purple/20 to-academy-lightblue/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-gradient-to-br from-academy-lightblue/20 to-academy-blue/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 text-center max-w-5xl mx-auto mb-8">
        {/* Status Badge */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary mr-2 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-primary">Inscriptions ouvertes</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 sm:mb-8 animate-fade-in text-center" style={{animationDelay: '0.2s'}}>
          <span className="block mb-1 sm:mb-2">L'Avenir de la</span>
          <span className="gradient-text block mb-1 sm:mb-2">Technologie</span>
          <span className="block text-gray-800">Commence Ici</span>
        </h1>


        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in text-center px-4" style={{animationDelay: '0.6s'}}>
          <span className="font-semibold text-academy-blue">AVS Institut de l'Innovation et de l'Intelligence Artificielle</span>
          <br className="hidden sm:block" />
          <br className="hidden sm:block" />
          est un institut leader en formation technologique et numérique, reconnu pour son excellence académique et son réseau de partenaires internationaux prestigieux. Voici une présentation enrichie de ses atouts majeurs
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-2 sm:mb-4 justify-center animate-fade-in px-4" style={{animationDelay: '0.8s'}}>
          <Button asChild className="bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-purple hover:to-academy-blue text-white font-bold px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Link to="/register">
              Commencer Maintenant
              <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="relative z-10 w-full">
        <AdvantageBadges />
      </div>

    </div>
  );
};

export default HeroBanner;
