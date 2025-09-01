import React from 'react';
import StandardPageLayout from '@/components/layouts/StandardPageLayout';
import PageHero from '@/components/layouts/PageHero';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import SEOHead from '@/components/SEOHead';
import AVSProgramOverview from '@/components/avs-institute/AVSProgramOverview';
import AVSSpecializations from '@/components/avs-institute/AVSSpecializations';
import AVSCertifications from '@/components/avs-institute/AVSCertifications';
import AVSCareers from '@/components/avs-institute/AVSCareers';
import AVSInvestment from '@/components/avs-institute/AVSInvestment';
import AVSSupport from '@/components/avs-institute/AVSSupport';
import AVSContact from '@/components/avs-institute/AVSContact';
import { Brain, Sparkles } from 'lucide-react';

const AVSInstitute = () => {
  return (
    <>
      <SEOHead 
        title="AVS Innovation - Technicien Spécialisé IA & Programmation | Formation Professionnelle"
        description="Formation de Technicien Spécialisé en Intelligence Artificielle et Programmation à Marrakech. Diplôme reconnu, 95% d'emploi, suivi post-formation d'un an."
        keywords="technicien spécialisé IA, technicien programmation, formation technique Marrakech, diplôme IA, formation programmation professionnelle"
      />
      
      <StandardPageLayout>
        <PageHero
          title="TECHNICIEN SPÉCIALISÉ EN IA & PROGRAMMATION"
          subtitle="Formation professionnelle reconnue par l'État"
          description="🎓 Devenez un Technicien Spécialisé certifié en Intelligence Artificielle ou Programmation - Votre expertise technique commence ici !"
          icon={Brain}
          backgroundGradient="from-academy-blue via-academy-purple to-academy-lightblue"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 text-center px-2 sm:px-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl font-bold mb-2">2 ANS</div>
              <div className="text-xs sm:text-sm opacity-90">Formation technique diplômante</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl font-bold mb-2">TSIA / TSDI</div>
              <div className="text-xs sm:text-sm opacity-90">Diplôme Technicien Spécialisé</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30 sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold mb-2">1 AN</div>
              <div className="text-xs sm:text-sm opacity-90">Suivi post-diplôme</div>
            </div>
          </div>
        </PageHero>

        <AVSProgramOverview />
        <AVSSpecializations />
        <AVSCertifications />
        <AVSCareers />
        <AVSInvestment />
        <AVSSupport />
        <AVSContact />
      </StandardPageLayout>
    </>
  );
};

export default AVSInstitute;