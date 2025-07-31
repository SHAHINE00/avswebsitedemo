import React from 'react';
import { Globe } from 'lucide-react';

const AboutMissionSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Notre Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              AVS Innovation Institute a pour mission de démocratiser l'accès aux formations 
              technologiques de pointe. Nous croyons que chaque individu mérite d'avoir les 
              compétences nécessaires pour prospérer dans l'économie numérique.
            </p>
            <p className="text-lg text-gray-700">
              Depuis notre création, nous nous efforçons de créer un environnement 
              d'apprentissage stimulant où la théorie rencontre la pratique, et où 
              l'innovation guide chaque étape du parcours pédagogique.
            </p>
          </div>
          <div className="bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 p-8 rounded-lg">
            <Globe className="w-16 h-16 text-academy-blue mb-4" />
            <h3 className="text-xl font-semibold mb-4">Vision 2030</h3>
            <p className="text-gray-700">
              Notre ambition est de devenir une référence mondiale en matière de formation technologique.
              Nous visons à former 10 000 professionnels hautement qualifiés d'ici 2030.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMissionSection;