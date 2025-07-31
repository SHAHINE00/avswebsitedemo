import React from 'react';
import SEOHead from '@/components/SEOHead';
import DynamicPageRenderer from '@/components/ui/DynamicPageRenderer';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="À propos - AVS Innovation Institute"
        description="Découvrez l'histoire, la mission et les valeurs d'AVS Innovation Institute. Leader en formation technologique avec plus de 500 étudiants formés."
        keywords="about, histoire, mission, valeurs, formation technologique, AVS Innovation"
      />
      
      <DynamicPageRenderer pageName="about" />
    </div>
  );
};

export default About;