
import React from 'react';
import StandardPageLayout from '@/components/layouts/StandardPageLayout';
import PageHero from '@/components/layouts/PageHero';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import CareerSection from '@/components/careers/CareerSection';
import HeroStatsGrid from '@/components/careers/HeroStatsGrid';
import EntrepreneurshipSection from '@/components/careers/EntrepreneurshipSection';
import SuccessStoriesSection from '@/components/careers/SuccessStoriesSection';
import CTASection from '@/components/careers/CTASection';
import { Brain, Code, TrendingUp, Megaphone } from 'lucide-react';
import { aiCareers, programmingCareers, digitalMarketingCareers, entrepreneurshipOpportunities, successStats } from '@/data/careersDataFrench';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Careers = () => {
  return (
    <StandardPageLayout>
      <SEOHead {...pageSEO.careers} />
      
      <PageHero
        title="+26 Spécialisations Certifiées Internationalement"
        description="Découvrez +26 spécialisations certifiées par MIT, Google, Microsoft, IBM, Harvard, Stanford et plus encore. Obtenez votre certification internationale en 3-8 semaines et transformez votre carrière professionnelle."
        icon={TrendingUp}
        backgroundGradient="from-academy-purple via-academy-blue to-academy-lightblue"
      >
        <HeroStatsGrid stats={successStats} />
      </PageHero>
      
      <SectionWrapper padding="lg">
        <div className="max-w-7xl mx-auto">
            
            {/* Three Pillars Section */}
            <div className="space-y-20">
              
              {/* Pillar 1: AI & Data Science */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-blue/20 to-academy-blue/30 p-6 rounded-3xl shadow-lg">
                    <Brain className="w-16 h-16 text-academy-blue" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
                  Pilier Intelligence Artificielle & Science des Données
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  11 spécialisations certifiées par MIT, Google, Microsoft, IBM, Harvard et Stanford pour maîtriser l'IA générative, l'apprentissage automatique et l'analyse de données
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-blue/5 border border-academy-blue/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-blue/10 to-academy-blue/20 rounded-xl flex items-center justify-center">
                            <Brain className="w-8 h-8 text-academy-blue" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Durée:</span>
                             <span className="font-semibold text-academy-blue">{career.duration}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Certification:</span>
                             <span className="font-semibold text-academy-blue">{career.certification}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Partenaires:</span>
                             <span className="font-semibold text-academy-blue">{career.certifyingPartners}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Programming & Tech Infrastructure */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-purple/20 to-academy-purple/30 p-6 rounded-3xl shadow-lg">
                    <Code className="w-16 h-16 text-academy-purple" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                  Pilier Programmation & Infrastructure Technique
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  11 spécialisations certifiées par Google, Microsoft, AWS, IBM et Unity pour maîtriser les technologies les plus demandées sur le marché
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {programmingCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-purple/5 border border-academy-purple/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-purple/10 to-academy-purple/20 rounded-xl flex items-center justify-center">
                            <Code className="w-8 h-8 text-academy-purple" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Durée:</span>
                             <span className="font-semibold text-academy-purple">{career.duration}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Certification:</span>
                             <span className="font-semibold text-academy-purple">{career.certification}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Partenaires:</span>
                             <span className="font-semibold text-academy-purple">{career.certifyingPartners}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: Digital Marketing & Creative */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-lightblue/20 to-academy-lightblue/30 p-6 rounded-3xl shadow-lg">
                    <Megaphone className="w-16 h-16 text-academy-lightblue" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-lightblue to-academy-blue bg-clip-text text-transparent">
                  Pilier Marketing Digital & Créatif
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  12 spécialisations certifiées par Google, Meta, Adobe, Stanford et PMI pour dominer l'économie créative et le marketing digital
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {digitalMarketingCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-lightblue/5 border border-academy-lightblue/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-lightblue/10 to-academy-lightblue/20 rounded-xl flex items-center justify-center">
                            <Megaphone className="w-8 h-8 text-academy-lightblue" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Durée:</span>
                             <span className="font-semibold text-academy-lightblue">{career.duration}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Certification:</span>
                             <span className="font-semibold text-academy-lightblue">{career.certification}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Partenaires:</span>
                             <span className="font-semibold text-academy-lightblue">{career.certifyingPartners}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Entrepreneurship Section */}
            <div className="mt-20">
              <EntrepreneurshipSection opportunities={entrepreneurshipOpportunities} />
            </div>


            {/* Call to Action */}
            <CTASection />
          </div>
      </SectionWrapper>
    </StandardPageLayout>
  );
};

export default Careers;
