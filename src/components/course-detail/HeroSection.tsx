import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-accent overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
          <Sparkles className="w-4 h-4" />
          Programme d'Excellence
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        
        <Link 
          to="/register" 
          className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          Commencer maintenant
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;