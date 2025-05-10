
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const jobOpenings = [
  {
    title: "Formateur en Intelligence Artificielle",
    department: "Éducation",
    type: "Temps plein",
    location: "Paris",
    description: "Nous recherchons un expert en Intelligence Artificielle pour rejoindre notre équipe de formateurs et partager ses connaissances avec nos étudiants."
  },
  {
    title: "Développeur Full Stack",
    department: "Technique",
    type: "Temps plein",
    location: "Remote",
    description: "Rejoignez notre équipe technique pour développer et améliorer notre plateforme d'apprentissage en ligne."
  },
  {
    title: "Responsable Marketing Digital",
    department: "Marketing",
    type: "Temps plein",
    location: "Lyon",
    description: "Nous cherchons un responsable marketing digital pour promouvoir nos formations et attirer de nouveaux étudiants."
  },
  {
    title: "Coach Pédagogique (temps partiel)",
    department: "Éducation",
    type: "Temps partiel",
    location: "Marseille / Remote",
    description: "Accompagnez nos étudiants dans leur parcours d'apprentissage et aidez-les à réussir leurs projets."
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-purple to-academy-blue text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Carrières</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Rejoignez notre équipe et participez à la formation de la prochaine génération d'experts en technologie.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Postes disponibles</h2>
            
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-academy-blue/10 text-academy-blue px-3 py-1 rounded-full text-sm">{job.department}</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{job.type}</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{job.location}</span>
                  </div>
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  <Button className="bg-academy-blue hover:bg-academy-purple text-white">
                    Postuler maintenant
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-academy-gray rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas le poste qui vous convient ?</h2>
              <p className="text-gray-700 mb-6">
                Envoyez-nous une candidature spontanée et parlez-nous de vous et de ce que vous pourriez apporter à notre équipe.
              </p>
              <Button className="bg-academy-blue hover:bg-academy-purple text-white">
                Candidature spontanée
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
