
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <div className="flex justify-center gap-8 mb-10">
      <div className="text-center">
        <div className="text-2xl font-bold text-academy-blue">26</div>
        <div className="text-sm text-gray-500">formation</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-academy-purple">95%</div>
        <div className="text-sm text-gray-500">taux de réussite</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-academy-lightblue">500+</div>
        <div className="text-sm text-gray-500">diplômés/certifiés</div>
      </div>
    </div>
  );
};

export default StatsSection;
