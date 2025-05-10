
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Video = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vidéo de présentation</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez notre formation en détail à travers cette vidéo de présentation.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-lg mb-8">
              {/* Video player would be embedded here */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Vidéo de présentation</p>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h2>Présentation de nos formations</h2>
              <p>
                Dans cette vidéo, nos formateurs vous présentent en détail les formations en Intelligence Artificielle et en Programmation.
                Vous découvrirez le contenu de chaque module, la méthodologie d'enseignement et les projets pratiques que vous réaliserez.
              </p>
              
              <h3>Points abordés dans la vidéo :</h3>
              <ul>
                <li>Présentation des parcours de formation</li>
                <li>Méthodologie d'enseignement</li>
                <li>Projets pratiques</li>
                <li>Témoignages d'anciens étudiants</li>
                <li>Perspectives de carrière</li>
              </ul>
              
              <div className="mt-8 text-center">
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-3">
                  <Link to="/register">S'inscrire à une formation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Video;
