
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstructorsSection from '@/components/InstructorsSection';

const Instructors = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos formateurs</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez les experts qui vous accompagneront tout au long de votre parcours de formation.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <InstructorsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Instructors;
