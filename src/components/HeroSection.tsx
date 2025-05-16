
import React from 'react';
import HeroBanner from './hero/HeroBanner';
import AdvantageBadges from './hero/AdvantageBadges';
import CourseComparison from './hero/CourseComparison';
import CareerPaths from './hero/CareerPaths';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-28 pb-0 md:pt-32 md:pb-0 bg-gradient-to-br from-white to-academy-gray">
      <HeroBanner />
      <AdvantageBadges />
      <CourseComparison />
      <CareerPaths />
    </div>
  );
};

export default HeroSection;
