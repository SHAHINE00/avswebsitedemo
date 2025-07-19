
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Zap, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DownloadGuidePopup from '@/components/DownloadGuidePopup';
import CourseUniverseShowcase from './CourseUniverseShowcase';

const HeroBanner: React.FC = () => {
  const isMobile = useIsMobile();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 relative min-h-[80vh] flex flex-col items-center justify-center">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Patterns */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-academy-blue/20 to-academy-purple/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-academy-purple/20 to-academy-lightblue/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-academy-lightblue/20 to-academy-blue/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Decorative Lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-academy-blue/30 to-transparent"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-academy-purple/30 to-transparent"></div>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 text-center max-w-5xl mx-auto mb-16">
        {/* Status Badge */}
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm border border-academy-blue/20 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-academy-blue mr-2" />
            <span className="text-sm font-semibold text-academy-blue">Inscriptions ouvertes</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <span className="block mb-2">L'Avenir de la</span>
          <span className="gradient-text block mb-2">Technologie</span>
          <span className="block text-gray-800">Commence Ici</span>
        </h1>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-academy-blue"></div>
          <div className="flex gap-2">
            <Brain className="w-6 h-6 text-academy-blue" />
            <Zap className="w-6 h-6 text-academy-purple" />
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-academy-purple"></div>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
          <span className="font-semibold text-academy-blue">AVS Institut de l'Innovation et de l'Intelligence Artificielle</span>
          <br className="hidden sm:block" />
          Propulsez votre avenir grâce à AVS Innovation, l'institut de référence en technologies de pointe et compétences numériques. Notre offre englobe l'intelligence artificielle, la cybersécurité, la programmation avancée, la data science et bien plus—avec des certifications internationales reconnues, délivrées en partenariat avec les plus grandes universités et entreprises mondiales.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-center animate-fade-in" style={{animationDelay: '0.8s'}}>
          <Button asChild className="bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-purple hover:to-academy-blue text-white font-bold px-10 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Link to="/register">
              Commencer Maintenant
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            onClick={() => setIsPopupOpen(true)}
            variant="outline" 
            className="border-2 border-academy-purple text-academy-purple hover:bg-academy-purple hover:text-white font-bold px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <Download className="mr-2 h-5 w-5" />
            Guide IA Gratuit
          </Button>
        </div>
      </div>

      {/* Course Universe Showcase */}
      <div className="relative z-10 w-full">
        <CourseUniverseShowcase />
      </div>
      
      <DownloadGuidePopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </div>
  );
};

export default HeroBanner;
