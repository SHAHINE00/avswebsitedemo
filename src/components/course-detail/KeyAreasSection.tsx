import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Database, BarChart3, Eye, MessageCircle, Network, TrendingUp, ArrowRightLeft, PieChart, Target } from 'lucide-react';

interface KeyArea {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

interface KeyAreasSectionProps {
  keyAreas: KeyArea[];
}

const iconMap = {
  Brain,
  Database,
  BarChart3,
  Eye,
  MessageCircle,
  Network,
  TrendingUp,
  ArrowRightLeft,
  PieChart,
  Target
};

const KeyAreasSection: React.FC<KeyAreasSectionProps> = ({ keyAreas }) => {
  return (
    <section id="key-areas" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Domaines Clés d'Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Développez votre expertise dans les domaines les plus recherchés du marché
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {keyAreas.map((area, index) => {
            const IconComponent = iconMap[area.icon as keyof typeof iconMap] || Brain;
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${area.gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">
                    {area.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {area.description}
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

export default KeyAreasSection;