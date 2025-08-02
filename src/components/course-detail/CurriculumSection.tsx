import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock } from 'lucide-react';

interface Module {
  code: string;
  title: string;
  duration: string;
  description?: string;
}

interface CurriculumSectionProps {
  year: 1 | 2;
  modules: Module[];
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({ year, modules }) => {
  const anchorId = year === 1 ? "curriculum-year1" : "curriculum-year2";
  const bgClass = year === 1 ? "bg-gray-50" : "bg-white";
  const gradientClass = year === 1 ? "from-primary to-primary-dark" : "from-accent to-secondary";
  
  return (
    <section id={anchorId} className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Curriculum {year === 1 ? "Première" : "Deuxième"} Année
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {year === 1 
              ? "Acquérez les fondamentaux et développez une base solide"
              : "Spécialisez-vous et maîtrisez les techniques avancées"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${gradientClass} text-white text-sm font-medium rounded-full mb-4`}>
                  {module.code}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                
                {module.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-primary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Module Interactif</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;