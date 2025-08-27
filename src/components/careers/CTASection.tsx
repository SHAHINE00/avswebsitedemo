
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="text-center bg-academy-gray rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Prêt à Transformer Votre Carrière ?</h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
        Rejoignez des milliers d'étudiants qui ont déjà fait le premier pas vers une carrière tech passionnante.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button asChild size="lg" className="w-full sm:w-auto bg-academy-blue hover:bg-academy-purple text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Link to="/register">
            Commencer ma formation
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-academy-blue text-academy-blue hover:bg-academy-blue hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl">
          <Link to="/curriculum">
            Découvrir les programmes
          </Link>
        </Button>
      </div>
      
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
          <span>Pas d'engagement</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
          <span>Garantie emploi</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
          <span>Support 24/7</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
