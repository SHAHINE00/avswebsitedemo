
import React from 'react';
import HeroBanner from './hero/HeroBanner';
import CareerPaths from './hero/CareerPaths';

const HeroSection: React.FC = () => {
  return (
    <div className="pb-0 bg-gradient-to-br from-white to-academy-gray">
      <HeroBanner />
      <CareerPaths />
    </div>
  );
};

export default HeroSection;
