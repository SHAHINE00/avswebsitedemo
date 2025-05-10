
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Commencez votre parcours vers une carrière réussie dans la technologie.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Formulaire d'inscription</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                />
              </div>
              
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                <select
                  id="course"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                  required
                >
                  <option value="">Sélectionnez une formation</option>
                  <option value="ai">Formation Intelligence Artificielle</option>
                  <option value="programming">Formation Programmation</option>
                  <option value="both">Les deux formations</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    J'accepte les conditions générales et la politique de confidentialité
                  </span>
                </label>
              </div>
              
              <div>
                <Button type="submit" className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3">
                  S'inscrire maintenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
