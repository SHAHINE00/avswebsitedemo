import React from 'react';
import { Clock, Target, Trophy, Users } from 'lucide-react';

interface TLDRSectionProps {
  title?: string;
  points: {
    icon: React.ReactNode;
    text: string;
  }[];
  className?: string;
}

const TLDRSection: React.FC<TLDRSectionProps> = ({ 
  title = "TL;DR - Points Clés", 
  points, 
  className = "" 
}) => {
  return (
    <div className={`bg-gradient-to-r from-academy-blue/5 to-academy-purple/5 border-l-4 border-academy-blue rounded-lg p-6 mb-8 ${className}`}>
      <h3 className="flex items-center text-lg font-bold text-academy-blue mb-4">
        <Target className="w-5 h-5 mr-2" />
        {title}
      </h3>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-academy-blue mr-3 mt-0.5 flex-shrink-0">
              {point.icon}
            </span>
            <span className="text-gray-700 font-medium">{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TLDRSection;