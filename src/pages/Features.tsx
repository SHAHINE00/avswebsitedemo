
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/FeaturesSection';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Features = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...pageSEO.features} />
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos atouts</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez ce qui rend notre programme unique et comment il vous prépare pour une carrière réussie dans la technologie.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <FeaturesSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
