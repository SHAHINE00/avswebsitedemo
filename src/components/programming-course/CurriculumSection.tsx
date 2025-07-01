
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Module {
  code: string;
  title: string;
  duration: string;
}

interface CurriculumSectionProps {
  year: 1 | 2;
  modules: Module[];
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({ year, modules }) => {
  const isFirstYear = year === 1;
  const colorScheme = isFirstYear 
    ? "from-academy-purple to-academy-blue" 
    : "from-academy-blue to-academy-lightblue";
  const hoverColor = isFirstYear ? "academy-purple" : "academy-blue";

  return (
    <section 
      id={isFirstYear ? "curriculum" : "curriculum2"} 
      className={`py-20 ${isFirstYear ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-white'}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {isFirstYear ? 'Curriculum 1ère Année' : 'Curriculum 2ème Année'}
          </h2>
          <div className={`w-32 h-1 bg-gradient-to-r ${colorScheme} mx-auto rounded-full mb-6`}></div>
          <p className="text-xl text-gray-600">
            {isFirstYear 
              ? 'Fondamentaux de la programmation - 10 mois intensifs'
              : 'Technologies avancées et projets professionnels - 10 mois'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className={`bg-gradient-to-r ${colorScheme} text-white px-3 py-1 rounded-lg text-sm font-bold mr-3`}>
                    {module.code}
                  </span>
                  <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                    {module.duration}
                  </span>
                </div>
                <h3 className={`text-sm font-bold text-gray-900 leading-tight group-hover:text-${hoverColor} transition-colors duration-300`}>
                  {module.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
