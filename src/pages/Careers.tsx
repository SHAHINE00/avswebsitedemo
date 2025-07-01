
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CareerSection from '@/components/careers/CareerSection';
import HeroStatsGrid from '@/components/careers/HeroStatsGrid';
import EntrepreneurshipSection from '@/components/careers/EntrepreneurshipSection';
import SuccessStoriesSection from '@/components/careers/SuccessStoriesSection';
import CTASection from '@/components/careers/CTASection';
import { Brain, Code, TrendingUp } from 'lucide-react';
import { aiCareers, programmingCareers, entrepreneurshipOpportunities, successStats } from '@/data/careersData';

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
              Opportunités de Carrière en IA et Programmation
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Découvrez des carrières passionnantes dans les secteurs technologiques les plus dynamiques. 
              Transformez votre passion en expertise professionnelle.
            </p>
            
            <HeroStatsGrid stats={successStats} />
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* AI Careers Section */}
            <CareerSection
              title="Carrières en Intelligence Artificielle"
              description="L'IA révolutionne tous les secteurs. Rejoignez cette transformation technologique majeure."
              icon={<Brain className="w-8 h-8 text-academy-blue" />}
              careers={aiCareers}
              colorScheme="blue"
            />

            {/* Programming Careers Section */}
            <CareerSection
              title="Carrières en Programmation"
              description="Le développement logiciel est au cœur de la transformation digitale mondiale."
              icon={<Code className="w-8 h-8 text-academy-purple" />}
              careers={programmingCareers}
              colorScheme="purple"
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
