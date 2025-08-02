import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Target, Award, Users } from 'lucide-react';

interface PresentationSectionProps {
  sections: {
    title: string;
    icon: string;
    color: string;
    content: string;
  }[];
}

const iconMap = {
  BookOpen,
  Target,
  Award,
  Users
};

const PresentationSection: React.FC<PresentationSectionProps> = ({ sections }) => {
  return (
    <section id="presentation" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Présentation du Programme
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {sections.map((section, index) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap] || BookOpen;
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl ${section.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;