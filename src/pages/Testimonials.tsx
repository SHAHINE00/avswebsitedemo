
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...pageSEO.testimonials} />
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Témoignages</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez ce que disent nos diplômés sur leur expérience avec notre programme.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Testimonials;
