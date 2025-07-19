
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CareerSection from '@/components/careers/CareerSection';
import HeroStatsGrid from '@/components/careers/HeroStatsGrid';
import EntrepreneurshipSection from '@/components/careers/EntrepreneurshipSection';
import SuccessStoriesSection from '@/components/careers/SuccessStoriesSection';
import CTASection from '@/components/careers/CTASection';
import { Brain, Code, TrendingUp, Megaphone } from 'lucide-react';
import { aiCareers, programmingCareers, digitalMarketingCareers, entrepreneurshipOpportunities, successStats } from '@/data/careersData';

const Careers = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-purple via-academy-blue to-academy-lightblue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Opportunités de Carrière Digitales & Technologiques
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Découvrez 27+ carrières certifiées dans l'IA, la programmation et le marketing digital. 
              Obtenez votre certification internationale et transformez votre avenir professionnel.
            </p>
            
            <HeroStatsGrid stats={successStats} />
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* AI & Data Science Careers Section */}
            <CareerSection
              title="Carrières en IA & Data Science"
              description="L'intelligence artificielle révolutionne tous les secteurs. Obtenez votre certification internationale et rejoignez cette transformation technologique majeure."
              icon={<Brain className="w-8 h-8 text-academy-blue" />}
              careers={aiCareers}
              colorScheme="blue"
            />

            {/* Programming & Tech Infrastructure Section */}
            <CareerSection
              title="Carrières en Programmation & Infrastructure"
              description="Le développement logiciel et l'architecture cloud sont au cœur de la transformation digitale. Maîtrisez les technologies les plus demandées."
              icon={<Code className="w-8 h-8 text-academy-purple" />}
              careers={programmingCareers}
              colorScheme="purple"
            />

            {/* Digital Marketing & Content Creation Section */}
            <CareerSection
              title="Carrières en Marketing Digital & Création"
              description="Le marketing digital alimenté par l'IA offre des opportunités exceptionnelles. Créez du contenu innovant et gérez la présence digitale des marques."
              icon={<Megaphone className="w-8 h-8 text-academy-lightblue" />}
              careers={digitalMarketingCareers}
              colorScheme="green"
            />

            {/* Entrepreneurship Section */}
            <EntrepreneurshipSection opportunities={entrepreneurshipOpportunities} />

            {/* Success Stories Section */}
            <SuccessStoriesSection />

            {/* Call to Action */}
            <CTASection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
