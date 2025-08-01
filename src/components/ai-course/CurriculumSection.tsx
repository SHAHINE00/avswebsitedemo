
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
    ? "from-academy-blue to-academy-purple" 
    : "from-academy-purple to-academy-lightblue";
  const hoverColor = isFirstYear ? "academy-blue" : "academy-purple";

  return (
    <section 
      id={isFirstYear ? "curriculum" : "curriculum2"} 
      className={`py-20 ${isFirstYear ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-white'}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-gray-900">
            {isFirstYear ? 'Curriculum 1ère Année' : 'Curriculum 2ème Année'}
          </h2>
          <div className={`w-32 h-1 bg-gradient-to-r ${colorScheme} mx-auto rounded-full mb-6`}></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            {isFirstYear 
              ? 'Fondamentaux et bases techniques - 10 mois intensifs'
              : 'Spécialisation avancée et projets professionnels - 10 mois'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full">
              <CardContent className="p-4 md:p-6 h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
                  <span className={`bg-gradient-to-r ${colorScheme} text-white px-2 py-1 rounded-lg text-xs md:text-sm font-bold flex-shrink-0`}>
                    {module.code}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg flex-shrink-0">
                    {module.duration}
                  </span>
                </div>
                <h3 className={`text-xs md:text-sm font-bold text-gray-900 leading-tight group-hover:text-${hoverColor} transition-colors duration-300 flex-1 break-words`}>
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
