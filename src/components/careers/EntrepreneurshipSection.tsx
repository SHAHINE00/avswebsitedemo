
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
    <section className="mb-20">
      <div className="bg-gradient-to-r from-academy-purple via-academy-blue to-academy-lightblue rounded-3xl p-12 text-white text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-4 rounded-2xl">
            <Rocket className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold mb-6">Créez Votre Startup Tech</h2>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          L'entrepreneuriat technologique offre des opportunités illimitées. 
          Transformez vos idées en solutions innovantes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3">{opportunity.title}</h3>
              <p className="text-white/90 mb-4">{opportunity.description}</p>
              <div className="text-academy-lightblue font-semibold mb-4">{opportunity.market}</div>
              <div className="space-y-2">
                {opportunity.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
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
