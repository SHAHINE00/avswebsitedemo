import React from 'react';
import { Award, Users, Globe, Lightbulb } from 'lucide-react';

const AboutHistorySection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Notre Histoire</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2014 - Création</h3>
                <p className="text-gray-700">
                  Fondation d'AVS Innovation Institute avec pour objectif de créer 
                  un nouveau modèle de formation technologique adapté aux besoins du marché.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2017 - Expansion</h3>
                <p className="text-gray-700">
                  Lancement de nos premiers programmes en intelligence artificielle 
                  et développement web, avec plus de 100 étudiants la première année.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2020 - Digitalisation</h3>
                <p className="text-gray-700">
                  Adaptation rapide à l'apprentissage en ligne avec le développement 
                  de notre plateforme d'apprentissage interactive et immersive.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-academy-blue rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2024 - Innovation</h3>
                <p className="text-gray-700">
                  Intégration de l'IA dans nos méthodes pédagogiques et lancement 
                  de nouveaux programmes en cybersécurité et analyse de données.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistorySection;