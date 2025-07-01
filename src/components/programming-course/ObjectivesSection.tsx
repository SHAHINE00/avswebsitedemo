
import React from 'react';

const ObjectivesSection = () => {
  return (
    <section id="objectifs" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Objectifs Généraux</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-purple to-academy-blue mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une vision complète pour former les développeurs de demain
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                Notre programme de formation en programmation vise à développer une expertise complète 
                dans le développement logiciel moderne, en couvrant tous les aspects essentiels du métier 
                de développeur.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Compétences Techniques</h3>
                  <ul className="space-y-2">
                    <li>• Maîtrise des langages de programmation</li>
                    <li>• Développement web et mobile</li>
                    <li>• Gestion des bases de données</li>
                    <li>• Architecture logicielle</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Compétences Professionnelles</h3>
                  <ul className="space-y-2">
                    <li>• Gestion de projets agiles</li>
                    <li>• Travail en équipe</li>
                    <li>• Résolution de problèmes</li>
                    <li>• Veille technologique</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
