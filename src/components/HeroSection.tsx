
import React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, GraduationCap, Stars } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-academy-gray">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="flex items-center mb-4">
            <span className="inline-block px-3 py-1 bg-academy-blue/10 text-academy-blue rounded-full text-sm font-medium">
              Inscriptions ouvertes
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Devenez <span className="gradient-text">Spécialiste en AVS AI Course</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            Maîtrisez les technologies d'AI de pointe grâce à notre formation complète. 
            Rejoignez des milliers de diplômés qui ont boosté leur carrière dans l'industrie de l'AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
              S'inscrire
            </Button>
            <Button variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-8 py-6 text-lg">
              Télécharger le programme
            </Button>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-6 text-gray-700">
            <div className="flex items-center">
              <GraduationCap className="text-academy-blue mr-2" />
              <span>5000+ diplômés</span>
            </div>
            <div className="flex items-center">
              <BrainCircuit className="text-academy-blue mr-2" />
              <span>Reconnu par le secteur</span>
            </div>
            <div className="flex items-center">
              <Stars className="text-academy-blue mr-2" />
              <span>Note : 4.8/5</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-academy-blue/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-academy-purple/10 rounded-full filter blur-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
              alt="Formation AI" 
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
