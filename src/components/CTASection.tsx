
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Lancez votre parcours de spécialiste AVS IA Course aujourd'hui
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10">
            Rejoignez des milliers de diplômés qui ont transformé leur carrière grâce à notre programme phare. Les places partent vite !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-white text-academy-blue hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
              <Link to="/register">
                S'inscrire <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg">
              <Link to="/appointment">
                Prendre rendez-vous
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80">
            Places limitées. Prochaine rentrée : 30 octobre 2025.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
