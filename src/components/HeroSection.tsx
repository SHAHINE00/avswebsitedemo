
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit, GraduationCap, Globe, Briefcase } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-28 pb-0 md:pt-32 md:pb-0 bg-gradient-to-br from-white to-academy-gray">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="flex items-center mb-4">
            <span className="inline-block px-3 py-1 bg-academy-blue/10 text-academy-blue rounded-full text-sm font-medium">
              Inscriptions ouvertes
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-center md:text-left">
            <span className="gradient-text">L'Avenir de la Technologie Commence Ici Explorez Apprenez Innovez</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            AVS l'institut de l'Innovation et de l'Intelligence Artificielle - Maîtriser les technologies d'IA et de Programmation de pointe grâce à notre formation la plus complète. Rejoignez les milliers de développements qui boostent votre carrière dans l'industrie de l'IA et de la programmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
              <Link to="/register">S'inscrire</Link>
            </Button>
            <Button asChild variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-8 py-6 text-lg">
              <Link to="/video">
                <Video className="mr-2" />
                Regarde le video
              </Link>
            </Button>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-6 text-gray-700">
            <div className="flex items-center">
              <GraduationCap className="text-academy-blue mr-2" />
              <span>🎓 Formation reconnue par l'État</span>
            </div>
            <div className="flex items-center">
              <Globe className="text-academy-blue mr-2" />
              <span>🌍 Certification valable à l'international</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="text-academy-blue mr-2" />
              <span>💼 Métiers tech rémunérateurs</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-academy-blue/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-academy-purple/10 rounded-full filter blur-xl"></div>
            <img 
              src="/lovable-uploads/5f417ca9-ec0a-42b3-9e82-56b7ec1866fe.png"
              alt="Équipe collaborant sur un projet de programmation IA" 
              className="relative z-10 rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-academy-blue rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
