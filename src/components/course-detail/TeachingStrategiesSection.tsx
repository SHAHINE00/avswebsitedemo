import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, 
  ClipboardCheck, 
  Wrench, 
  Users, 
  FileBarChart, 
  Award, 
  Settings, 
  Compass 
} from 'lucide-react';

interface TeachingStrategy {
  title: string;
  icon: string;
  color: string;
  content: string;
  features: string[];
}

interface TeachingStrategiesSectionProps {
  teachingStrategies: TeachingStrategy[];
}

const iconMap = {
  GraduationCap,
  ClipboardCheck,
  Wrench,
  Users,
  FileBarChart,
  Award,
  Settings,
  Compass
};

const TeachingStrategiesSection: React.FC<TeachingStrategiesSectionProps> = ({ 
  teachingStrategies 
}) => {
  return (
    <section id="teaching-strategies" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stratégies Pédagogiques
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une approche pédagogique moderne et efficace pour maximiser votre apprentissage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {teachingStrategies.map((strategy, index) => {
            const IconComponent = iconMap[strategy.icon as keyof typeof iconMap] || GraduationCap;
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${strategy.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {strategy.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {strategy.content}
                  </p>

                  <div className="space-y-2">
                    {strategy.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Excellence Pédagogique Card */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-r from-primary to-accent">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Excellence Pédagogique
            </h3>
            <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
              Notre engagement : vous offrir une formation de qualité supérieure 
              avec un accompagnement personnalisé pour garantir votre réussite professionnelle.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TeachingStrategiesSection;