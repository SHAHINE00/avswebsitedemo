
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import FormationCard from './FormationCard';
import { useCourses } from '@/hooks/useCourses';
import { Brain, Code, Database, Cloud, Target, Shield, type LucideIcon } from 'lucide-react';
import { useSwipeableCards } from '@/hooks/useSwipeGestures';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useIsMobile } from '@/hooks/use-mobile-simple';
import { CourseGridSkeleton } from '@/components/ui/SkeletonLoaders';
import { RefreshCw } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  brain: Brain,
  code: Code,
  database: Database,
  cloud: Cloud,
  target: Target,
  shield: Shield,
};

const FormationCards: React.FC = () => {
  const { courses, loading, error, refetch } = useCourses();
  const isMobile = useIsMobile();
  
  // Mobile swipe functionality for course cards
  const swipeableCards = useSwipeableCards(courses, 0);
  
  // Pull to refresh functionality
  const pullToRefresh = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    },
    enabled: isMobile
  });

  if (loading) {
    return (
      <div 
        ref={pullToRefresh.containerRef as React.RefObject<HTMLDivElement>}
        style={pullToRefresh.containerStyle}
        className="relative"
      >
        {/* Pull to refresh indicator */}
        {pullToRefresh.isPulling && (
          <div className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10">
            <div className="flex items-center space-x-2 text-primary">
              <RefreshCw className={`w-5 h-5 ${pullToRefresh.isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {pullToRefresh.shouldTrigger ? 'Relâchez pour actualiser' : 'Tirez pour actualiser'}
              </span>
            </div>
          </div>
        )}
        
        <CourseGridSkeleton count={4} className="max-w-5xl mx-auto mb-10" />
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
    <div 
      ref={pullToRefresh.containerRef as React.RefObject<HTMLDivElement>}
      style={pullToRefresh.containerStyle}
      className="relative"
    >
      {/* Pull to refresh indicator */}
      {pullToRefresh.isPulling && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-4 z-10">
          <div className="flex items-center space-x-2 text-primary">
            <RefreshCw className={`w-5 h-5 ${pullToRefresh.isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {pullToRefresh.shouldTrigger ? 'Relâchez pour actualiser' : 'Tirez pour actualiser'}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto mb-10 lg:mb-16 px-4 sm:px-6">
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
    </div>
  );
};

export default FormationCards;
