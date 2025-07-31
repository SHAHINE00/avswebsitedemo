
import React from 'react';
import SEOHead from '@/components/SEOHead';
import DynamicPageRenderer from '@/components/ui/DynamicPageRenderer';
import { pageSEO } from '@/utils/seoData';

const Index = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <SEOHead {...pageSEO.home} />
      
      <div style={{ paddingTop: '4rem' }}>
        <DynamicPageRenderer pageName="home" />
      </div>
    </div>
  );
};

export default Index;
