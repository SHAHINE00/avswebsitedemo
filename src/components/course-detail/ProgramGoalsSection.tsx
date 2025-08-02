import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Lightbulb, Users2, TrendingUp, BarChart3, Target, CheckCircle } from 'lucide-react';

interface ProgramGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

interface ProgramGoalsSectionProps {
  programGoals: ProgramGoal[];
}

const iconMap = {
  Award,
  Lightbulb,
  Users2,
  TrendingUp,
  BarChart3,
  Target
};

const ProgramGoalsSection: React.FC<ProgramGoalsSectionProps> = ({ programGoals }) => {
  return (
    <section id="objectives" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Objectifs du Programme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Développez les compétences clés pour exceller dans votre domaine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {programGoals.map((goal) => {
            const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Award;
            
            return (
              <Card key={goal.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className={`absolute top-0 right-0 w-40 h-40 ${goal.color} opacity-10 rounded-full transform translate-x-12 -translate-y-12`}></div>
                  
                  <div className={`w-16 h-16 ${goal.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                    {goal.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 relative z-10">
                    {goal.description}
                  </p>

                  <div className="space-y-3 relative z-10">
                    {goal.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
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

export default ProgramGoalsSection;