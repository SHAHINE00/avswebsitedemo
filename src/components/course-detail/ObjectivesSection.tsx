import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Target, BookOpen, Users } from 'lucide-react';

interface ObjectivesSectionProps {
  objectives: {
    mainTitle: string;
    description: string;
    leftColumn: {
      title: string;
      skills: string[];
      description: string;
    };
    rightColumn: {
      sections: {
        title: string;
        description: string;
      }[];
    };
  };
}

const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ objectives }) => {
  return (
    <section id="general-objectives" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {objectives.mainTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {objectives.description}
          </p>
        </div>

        <Card className="max-w-7xl mx-auto shadow-xl border-0">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column */}
              <div className="p-12 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {objectives.leftColumn.title}
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  {objectives.leftColumn.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {objectives.leftColumn.description}
                </p>
              </div>

              {/* Right Column */}
              <div className="p-12">
                <div className="space-y-8">
                  {objectives.rightColumn.sections.map((section, index) => {
                    const icons = [BookOpen, Users, Target];
                    const IconComponent = icons[index] || Target;
                    const gradients = [
                      "from-blue-500 to-purple-600",
                      "from-green-500 to-blue-600", 
                      "from-purple-500 to-pink-600"
                    ];
                    
                    return (
                      <div key={index} className="flex gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${gradients[index]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {section.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ObjectivesSection;