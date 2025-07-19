
import React from 'react';
import HeroBanner from './hero/HeroBanner';
import CareerPaths from './hero/CareerPaths';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-0 bg-gradient-to-br from-white to-academy-gray">
      <HeroBanner />
      <CareerPaths />
    </div>
  );
};

export default HeroSection;
