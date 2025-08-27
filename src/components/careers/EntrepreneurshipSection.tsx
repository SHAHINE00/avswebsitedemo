
import React from 'react';
import { Rocket, CheckCircle } from 'lucide-react';

interface EntrepreneurshipOpportunity {
  title: string;
  description: string;
  market: string;
  examples: string[];
}

interface EntrepreneurshipSectionProps {
  opportunities: EntrepreneurshipOpportunity[];
}

const EntrepreneurshipSection: React.FC<EntrepreneurshipSectionProps> = ({ opportunities }) => {
  return (
    <section className="mb-16 sm:mb-20">
      <div className="bg-gradient-to-r from-academy-purple via-academy-blue to-academy-lightblue rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center mb-8 sm:mb-12">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-white/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Créez Votre Startup Tech</h2>
        <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          L'entrepreneuriat technologique offre des opportunités illimitées. 
          Transformez vos idées en solutions innovantes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{opportunity.title}</h3>
              <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">{opportunity.description}</p>
              <div className="text-academy-lightblue font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{opportunity.market}</div>
              <div className="space-y-1 sm:space-y-2">
                {opportunity.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="flex items-center text-xs sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-300 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EntrepreneurshipSection;
