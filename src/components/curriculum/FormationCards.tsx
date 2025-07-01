
import React from 'react';
import { Brain, Code, Target, Database, Cloud } from 'lucide-react';
import FormationCard from './FormationCard';

const FormationCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
      {/* Formation IA */}
      <FormationCard
        title="Formation IA"
        subtitle="Intelligence Artificielle"
        modules="27 modules"
        duration="18 mois"
        diploma="Diplôme certifié"
        feature1="Machine Learning"
        feature2="Big Data"
        icon={Brain}
        gradientFrom="from-academy-blue"
        gradientTo="to-academy-purple"
        buttonTextColor="text-academy-blue"
        linkTo="/ai-course"
        floatingColor1="bg-academy-lightblue/20"
        floatingColor2="bg-white/10"
      />
      
      {/* Formation Programmation */}
      <FormationCard
        title="Formation Programmation"
        subtitle="Développement Web & Mobile"
        modules="4 modules"
        duration="24 semaines"
        diploma="Diplôme certifié"
        feature1="Full Stack"
        feature2="DevOps"
        icon={Code}
        gradientFrom="from-academy-purple"
        gradientTo="to-academy-lightblue"
        buttonTextColor="text-academy-purple"
        linkTo="/programming-course"
        floatingColor1="bg-academy-blue/20"
        floatingColor2="bg-white/10"
      />
    </div>
  );
};

export default FormationCards;
