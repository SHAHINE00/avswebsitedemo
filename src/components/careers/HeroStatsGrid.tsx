
import React from 'react';

interface Stat {
  value: string;
  label: string;
  description: string;
}

interface HeroStatsGridProps {
  stats: Stat[];
}

const HeroStatsGrid: React.FC<HeroStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm sm:text-base md:text-lg font-semibold mb-1">{stat.label}</div>
          <div className="text-xs sm:text-sm opacity-80">{stat.description}</div>
        </div>
      ))}
    </div>
  );
};

export default HeroStatsGrid;
