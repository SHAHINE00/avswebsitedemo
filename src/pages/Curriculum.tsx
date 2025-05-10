
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CurriculumSection from '@/components/CurriculumSection';

const Curriculum = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Programme</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Explorez nos parcours pédagogiques complets en Intelligence Artificielle et en Programmation.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <CurriculumSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Curriculum;
