
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface SuccessStory {
  name: string;
  position: string;
  company: string;
  quote: string;
  achievement: string;
  achievementLabel: string;
  colorScheme: 'blue' | 'purple' | 'lightblue';
}

const SuccessStoriesSection: React.FC = () => {
  const successStories: SuccessStory[] = [
    {
      name: "Sarah M.",
      position: "Data Scientist",
      company: "Amazon",
      quote: "Formation complète qui m'a permis de décrocher mon poste de rêve en 6 mois",
      achievement: "€65k",
      achievementLabel: "Salaire de départ",
      colorScheme: "blue"
    },
    {
      name: "Marc L.",
      position: "CTO",
      company: "sa startup",
      quote: "J'ai lancé ma startup tech grâce aux compétences acquises. Levée de fonds réussie!",
      achievement: "€2M",
      achievementLabel: "Levée de fonds",
      colorScheme: "purple"
    },
    {
      name: "Julie R.",
      position: "Développeur Full Stack",
      company: "Google",
      quote: "Transition réussie depuis le marketing. Les formateurs sont exceptionnels!",
      achievement: "€78k",
      achievementLabel: "Salaire actuel",
      colorScheme: "lightblue"
    }
  ];

  const getColorClasses = (colorScheme: string) => {
    switch (colorScheme) {
      case 'blue':
        return {
          bgColor: 'bg-academy-blue/10',
          textColor: 'text-academy-blue',
          iconColor: 'text-academy-blue'
        };
      case 'purple':
        return {
          bgColor: 'bg-academy-purple/10',
          textColor: 'text-academy-purple',
          iconColor: 'text-academy-purple'
        };
      case 'lightblue':
        return {
          bgColor: 'bg-academy-lightblue/10',
          textColor: 'text-academy-lightblue',
          iconColor: 'text-academy-lightblue'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-600'
        };
    }
  };

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Témoignages de Réussite</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Découvrez comment nos diplômés ont transformé leur carrière
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {successStories.map((story, index) => {
          const colors = getColorClasses(story.colorScheme);
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className={`w-16 h-16 ${colors.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Star className={`w-8 h-8 ${colors.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{story.name}</h3>
                <p className={`${colors.textColor} font-semibold mb-2`}>{story.position} chez {story.company}</p>
                <p className="text-gray-700 text-sm mb-4">"{story.quote}"</p>
                <div className="text-2xl font-bold text-green-600">{story.achievement}</div>
                <div className="text-sm text-gray-600">{story.achievementLabel}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
