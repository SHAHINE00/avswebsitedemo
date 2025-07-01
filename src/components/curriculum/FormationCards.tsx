
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import FormationCard from './FormationCard';
import { useCourses } from '@/hooks/useCourses';
import { Brain, Code, Database, Cloud, Target, Shield, type LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  brain: Brain,
  code: Code,
  database: Database,
  cloud: Cloud,
  target: Target,
  shield: Shield,
};

const FormationCards: React.FC = () => {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mb-10">
        <p>Erreur lors du chargement des formations: {error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center text-gray-600 mb-10">
        <p>Aucune formation disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
      {courses.map((course) => {
        const IconComponent = iconMap[course.icon] || Brain;
        
        return (
          <FormationCard
            key={course.id}
            id={course.id}
            title={course.title}
            subtitle={course.subtitle || ''}
            modules={course.modules || ''}
            duration={course.duration || ''}
            diploma={course.diploma || ''}
            feature1={course.feature1 || ''}
            feature2={course.feature2 || ''}
            icon={IconComponent}
            gradientFrom={course.gradient_from}
            gradientTo={course.gradient_to}
            buttonTextColor={course.button_text_color}
            linkTo={course.link_to || '#'}
            floatingColor1={course.floating_color1}
            floatingColor2={course.floating_color2}
          />
        );
      })}
    </div>
  );
};

export default FormationCards;
