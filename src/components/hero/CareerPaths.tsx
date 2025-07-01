
import React from 'react';

const CareerPaths: React.FC = () => {
  return (
    <section className="career-opportunities">
      <div className="container mx-auto px-6 py-16 bg-academy-gray/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-center">Opportunités de Carrière en IA et Programmation</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center mb-12">
            Explorez des carrières passionnantes dans le domaine de l'Intelligence Artificielle et de la Programmation. Ces secteurs en pleine expansion offrent une multitude d'opportunités professionnelles et d'entrepreneuriat pour ceux qui sont prêts à innover et à transformer le monde.
          </p>
          
          <div className="career-categories grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="category bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-academy-blue">Carrières en Intelligence Artificielle</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Ingénieur en IA
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Data Scientist
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Développeur de Machine Learning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Ingénieur en Vision par Ordinateur
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Éthicien en IA
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-blue rounded-full mr-3"></span>
                  Architecte de Solutions IA
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Les professionnels de l'IA créent des systèmes capables d'apprendre, d'analyser et de résoudre des problèmes complexes, ouvrant ainsi des opportunités dans divers secteurs comme la santé, la finance, et l'automobile.
              </p>
            </div>
            
            <div className="category bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-academy-purple">Carrières en Programmation</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                  Développeur Logiciel
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                  Développeur Web
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                  Développeur Mobile
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                  Ingénieur DevOps
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-academy-purple rounded-full mr-3"></span>
                  Analyste Système
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                Les développeurs sont essentiels pour créer des logiciels, des applications mobiles, et des systèmes de gestion qui transforment l'expérience numérique dans tous les secteurs.
              </p>
            </div>
          </div>

          <div className="entrepreneurship-opportunities bg-gradient-to-r from-academy-purple to-academy-blue p-8 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Créez Votre Propre Entreprise</h3>
            <p className="text-lg mb-6 opacity-90">
              Au-delà des carrières traditionnelles, l'IA et la programmation offrent des opportunités exceptionnelles pour lancer vos propres projets entrepreneuriaux. Que vous souhaitiez créer des <strong>startups technologiques</strong>, développer des <strong>applications mobiles</strong>, ou bâtir des <strong>solutions d'IA sur mesure</strong>, le monde est à votre portée.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Création d'applications ou de services basés sur l'IA
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Lancer une entreprise de développement web ou mobile
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Créer une plateforme d'analyse de données ou de services cloud
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-white rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Développer des outils de cybersécurité ou d'automatisation
              </li>
            </ul>
            <p className="opacity-90">
              Les compétences acquises dans ces formations vous permettent de démarrer votre propre projet en tant qu'indépendant ou fondateur d'une entreprise technologique, avec la possibilité de travailler sur des solutions innovantes et de résoudre des défis mondiaux.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;
