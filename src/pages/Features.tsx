
import React from 'react';
import SEOHead from '@/components/SEOHead';
import DynamicPageRenderer from '@/components/ui/DynamicPageRenderer';
import { pageSEO } from '@/utils/seoData';

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead {...pageSEO.features} />
      
      <DynamicPageRenderer pageName="features" />
    </div>
  );
};

export default Features;
