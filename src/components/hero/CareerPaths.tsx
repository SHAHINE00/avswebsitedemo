
import React from 'react';

const CareerPaths: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16 bg-academy-gray/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-3 text-center">Opportunités de carrière</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-10">
          Nos formations vous préparent pour les métiers les plus demandés et les mieux rémunérés dans le secteur technologique.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Career Paths */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-academy-blue">Après la formation IA</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">🤖</span>
                <div>
                  <h4 className="font-semibold">Data Scientist</h4>
                  <p className="text-sm text-gray-600">Analyser des données pour en extraire des insights précieux</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">🧠</span>
                <div>
                  <h4 className="font-semibold">Ingénieur ML</h4>
                  <p className="text-sm text-gray-600">Créer et déployer des modèles d'apprentissage automatique</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">📊</span>
                <div>
                  <h4 className="font-semibold">Consultant IA</h4>
                  <p className="text-sm text-gray-600">Conseiller les entreprises sur leurs stratégies d'IA</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Programming Career Paths */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-academy-purple">Après la formation Programmation</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">💻</span>
                <div>
                  <h4 className="font-semibold">Développeur Full Stack</h4>
                  <p className="text-sm text-gray-600">Créer des applications web complètes de A à Z</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">📱</span>
                <div>
                  <h4 className="font-semibold">Développeur Mobile</h4>
                  <p className="text-sm text-gray-600">Concevoir des applications iOS et Android performantes</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <span className="text-xl mr-3">🔄</span>
                <div>
                  <h4 className="font-semibold">DevOps Engineer</h4>
                  <p className="text-sm text-gray-600">Automatiser et optimiser les déploiements d'applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;
