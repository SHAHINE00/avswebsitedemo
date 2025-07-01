
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const CTABottomSection: React.FC = () => {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-academy-gray to-white rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-3">
          <Star className="w-5 h-5 text-academy-blue mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Transformez votre carrière</h3>
          <Star className="w-5 h-5 text-academy-purple ml-2" />
        </div>
        <p className="text-gray-600 mb-4 max-w-xl mx-auto">
          Rejoignez des centaines d'étudiants qui ont choisi l'excellence
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-6 py-2">
            <Link to="/register">S'inscrire maintenant</Link>
          </Button>
          <Button asChild variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-6 py-2">
            <Link to="/contact">Plus d'informations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTABottomSection;
