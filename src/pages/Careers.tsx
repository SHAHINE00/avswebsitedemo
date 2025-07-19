
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
              31+ Spécialisations Certifiées Internationalement
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Découvrez nos 31+ spécialisations certifiées par MIT, Google, Microsoft, IBM, Harvard, Stanford et bien plus. 
              Obtenez votre certification internationale en 3-8 semaines et transformez votre carrière.
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
              title="Spécialisations IA & Science des Données"
              description="L'intelligence artificielle révolutionne tous les secteurs. 10+ spécialisations certifiées par MIT, Google, Microsoft, IBM, Harvard et Stanford pour maîtriser l'IA générative, le machine learning et l'analyse de données."
              icon={<Brain className="w-8 h-8 text-academy-blue" />}
              careers={aiCareers}
              colorScheme="blue"
            />

            {/* Programming & Tech Infrastructure Section */}
            <CareerSection
              title="Spécialisations Programmation & Infrastructure Tech"
              description="Le développement logiciel et l'architecture cloud sont au cœur de la transformation digitale. 10+ spécialisations certifiées par Google, Microsoft, AWS, IBM et Unity pour maîtriser les technologies les plus demandées."
              icon={<Code className="w-8 h-8 text-academy-purple" />}
              careers={programmingCareers}
              colorScheme="purple"
            />

            {/* Digital Marketing & Creative Section */}
            <CareerSection
              title="Spécialisations Marketing Digital & Création"
              description="Le marketing digital alimenté par l'IA et la création de contenu offrent des opportunités exceptionnelles. 12+ spécialisations certifiées par Google, Meta, Adobe, Stanford et PMI pour dominer l'économie créative."
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
