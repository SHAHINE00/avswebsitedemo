import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Heart, Lightbulb } from 'lucide-react';

const AboutValuesSection: React.FC = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-academy-blue" />,
      title: "Excellence pédagogique",
      description: "Nous nous engageons à fournir une formation de la plus haute qualité avec des méthodes d'apprentissage innovantes."
    },
    {
      icon: <Users className="w-8 h-8 text-academy-blue" />,
      title: "Accompagnement personnalisé",
      description: "Chaque apprenant bénéficie d'un suivi individualisé adapté à ses objectifs et son rythme d'apprentissage."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-academy-blue" />,
      title: "Innovation constante",
      description: "Nous intégrons les dernières technologies et tendances pour préparer nos étudiants aux défis de demain."
    },
    {
      icon: <Heart className="w-8 h-8 text-academy-blue" />,
      title: "Passion pour l'enseignement",
      description: "Notre équipe partage une passion commune pour transmettre le savoir et accompagner la réussite."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Nos Valeurs</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Ces valeurs fondamentales guident notre approche pédagogique et 
            notre engagement envers nos étudiants.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;