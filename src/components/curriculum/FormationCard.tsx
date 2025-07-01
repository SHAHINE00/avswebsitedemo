
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Award, LucideIcon } from 'lucide-react';

interface FormationCardProps {
  title: string;
  subtitle: string;
  modules: string;
  duration: string;
  diploma: string;
  feature1: string;
  feature2: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  buttonTextColor: string;
  linkTo: string;
  floatingColor1: string;
  floatingColor2: string;
}

const FormationCard: React.FC<FormationCardProps> = ({
  title,
  subtitle,
  modules,
  duration,
  diploma,
  feature1,
  feature2,
  icon: Icon,
  gradientFrom,
  gradientTo,
  buttonTextColor,
  linkTo,
  floatingColor1,
  floatingColor2
}) => {
  return (
    <div className="group relative overflow-hidden">
      {/* Main Card */}
      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
        <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm opacity-90">{subtitle}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="text-xs font-medium">{modules}</span>
          </div>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 opacity-75" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-2 opacity-75" />
            <span>{diploma}</span>
          </div>
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2 opacity-75" />
            <span>{feature1}</span>
          </div>
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2 opacity-75" />
            <span>{feature2}</span>
          </div>
        </div>

        {/* CTA */}
        <Button asChild className={`w-full bg-white ${buttonTextColor} hover:bg-gray-100 font-semibold rounded-xl transition-all group-hover:shadow-lg`}>
          <Link to={linkTo}>
            Découvrir le programme
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Floating Elements */}
      <div className={`absolute -top-2 -right-2 w-12 h-12 ${floatingColor1} rounded-full blur-xl`}></div>
      <div className={`absolute -bottom-2 -left-2 w-16 h-16 ${floatingColor2} rounded-full blur-xl`}></div>
    </div>
  );
};

export default FormationCard;
