import React from 'react';
import TLDRSection from '@/components/TLDRSection';
import { 
  GraduationCap, 
  Clock, 
  Trophy, 
  Users, 
  Briefcase,
  Award
} from 'lucide-react';

const TLDROptimizedSection: React.FC = () => {
  const tldrPoints = [
    {
      icon: <GraduationCap className="w-4 h-4" />,
      text: "3 piliers de formation : IA & Data Science, Programmation, Marketing Digital"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "Certifications Harvard, MIT, Stanford, Google, Microsoft, IBM"
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      text: "95% de réussite, 85% d'insertion professionnelle en 6 mois"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Formateurs experts, classes limitées à 15 étudiants maximum"
    },
    {
      icon: <Briefcase className="w-4 h-4" />,
      text: "Réseau de 200+ entreprises partenaires au Maroc et à l'international"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Formats flexibles : présentiel, hybride, e-learning 24/7"
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <TLDRSection 
          title="🎯 AVS INSTITUTE en Bref"
          points={tldrPoints}
        />
      </div>
    </section>
  );
};

export default TLDROptimizedSection;