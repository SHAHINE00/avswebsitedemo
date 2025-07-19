
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Programmes</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Accédez à des certifications de classe mondiale grâce à nos partenariats d'excellence avec les plus grandes universités (Harvard, MIT, Stanford) et entreprises technologiques (Google, Microsoft, IBM). Explorez nos trois piliers de formation : IA & Data Science, Programmation & Infrastructure, et Marketing Digital & Créatif.
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
