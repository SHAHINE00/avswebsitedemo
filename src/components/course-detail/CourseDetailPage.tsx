import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { coursesDetailData, type CourseDetailData } from '@/data/coursesDetailData';
import HeroSection from '@/components/course-detail/HeroSection';
import PresentationSection from '@/components/course-detail/PresentationSection';
import KeyAreasSection from '@/components/course-detail/KeyAreasSection';
import CurriculumSection from '@/components/course-detail/CurriculumSection';
import ProgramGoalsSection from '@/components/course-detail/ProgramGoalsSection';
import ObjectivesSection from '@/components/course-detail/ObjectivesSection';
import TeachingStrategiesSection from '@/components/course-detail/TeachingStrategiesSection';
import TableOfContentsSection from '@/components/course-detail/TableOfContentsSection';
import SynthesisSection from '@/components/course-detail/SynthesisSection';
import CTASection from '@/components/course-detail/CTASection';
import ScrollToTop from '@/components/ui/ScrollToTop';

const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  
  if (!courseSlug || !coursesDetailData[courseSlug]) {
    return <Navigate to="/404" replace />;
  }

  const courseData: CourseDetailData = coursesDetailData[courseSlug];

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      
      <HeroSection
        title={courseData.heroTitle}
        subtitle={courseData.heroSubtitle}
      />

      <TableOfContentsSection 
        tableOfContents={courseData.tableOfContents}
      />

      <PresentationSection
        sections={courseData.presentationSections}
      />

      <KeyAreasSection
        keyAreas={courseData.keyAreas}
      />

      <CurriculumSection
        year={1}
        modules={courseData.firstYearModules}
      />

      {courseData.secondYearModules && (
        <CurriculumSection
          year={2}
          modules={courseData.secondYearModules}
        />
      )}

      <ProgramGoalsSection
        programGoals={courseData.programGoals}
      />

      <ObjectivesSection
        objectives={courseData.objectives}
      />

      <TeachingStrategiesSection
        teachingStrategies={courseData.teachingStrategies}
      />

      <SynthesisSection
        synthesis={courseData.synthesis}
      />

      <CTASection />
    </div>
  );
};

export default CourseDetailPage;