
import React from 'react';
import CareerCard, { Career } from './CareerCard';

interface CareerSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  careers: Career[];
  colorScheme: 'blue' | 'purple' | 'green';
}

const CareerSection: React.FC<CareerSectionProps> = ({ 
  title, 
  description, 
  icon, 
  careers, 
  colorScheme 
}) => {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className={`${
            colorScheme === 'blue' ? 'bg-academy-blue/10' : 
            colorScheme === 'purple' ? 'bg-academy-purple/10' : 
            'bg-academy-lightblue/10'
          } p-3 rounded-xl`}>
            {icon}
          </div>
        </div>
        <h2 className="text-4xl font-bold mb-4 gradient-text">{title}</h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {careers.map((career, index) => (
          <CareerCard key={index} career={career} colorScheme={colorScheme} />
        ))}
      </div>
    </section>
  );
};

export default CareerSection;
