import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Lightbulb, Briefcase, TrendingUp, Wrench } from 'lucide-react';

interface SynthesisItem {
  title: string;
  icon: string;
  gradient: string;
  details: string[];
}

interface SynthesisSectionProps {
  synthesis: SynthesisItem[];
}

const iconMap = {
  Award,
  Lightbulb,
  Briefcase,
  TrendingUp,
  Wrench
};

const SynthesisSection: React.FC<SynthesisSectionProps> = ({ synthesis }) => {
  return (
    <section id="synthesis" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Synthèse du Programme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un résumé des points clés qui font l'excellence de notre formation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {synthesis.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Award;
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {item.title}
                  </h3>

                  <div className="space-y-3">
                    {item.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-left">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SynthesisSection;