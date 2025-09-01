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
        title="AVS Innovation & Institut d'IA - Excellence en Intelligence Artificielle"
        description="Programme de formation complet de deux ans en Intelligence Artificielle et Programmation. 95% de taux d'emploi, certifications internationales, suivi post-diplôme d'un an."
        keywords="formation IA, intelligence artificielle Marrakech, programmation, AVS Innovation, institut technologie"
      />
      
      <StandardPageLayout>
        <PageHero
          title="AVS INNOVATION & INSTITUT D'IA"
          subtitle="Excellence en éducation à l'intelligence artificielle"
          description="🧠 Bienvenue à l'Institut AVS Innovation - Votre voyage vers un avenir technologique brillant commence ici !"
          icon={Brain}
          backgroundGradient="from-academy-blue via-academy-purple to-academy-lightblue"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm opacity-90">Taux d'emploi en 6 mois</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Réseau d'anciens élèves</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-3xl font-bold mb-2">1 AN</div>
              <div className="text-sm opacity-90">Suivi post-diplôme</div>
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