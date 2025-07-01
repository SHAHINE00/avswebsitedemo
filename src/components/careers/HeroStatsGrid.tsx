
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-lg font-semibold mb-1">{stat.label}</div>
          <div className="text-sm opacity-80">{stat.description}</div>
        </div>
      ))}
    </div>
  );
};

export default HeroStatsGrid;
