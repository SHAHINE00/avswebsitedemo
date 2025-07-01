
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, CheckCircle, type LucideIcon } from 'lucide-react';
import EnrollmentButton from './EnrollmentButton';

interface FormationCardProps {
  id?: string;
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
  id,
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
  floatingColor2,
}) => {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Floating elements */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 ${floatingColor1} rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
      <div className={`absolute -bottom-6 -left-6 w-32 h-32 ${floatingColor2} rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <CardContent className="relative z-10 p-8 h-full flex flex-col">
        {/* Header with icon */}
        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mr-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-grow">
            <h3 className={`text-2xl font-bold mb-1 ${buttonTextColor} group-hover:text-academy-purple transition-colors duration-300`}>
              {title}
            </h3>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-4 mb-6">
          {/* Duration badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white text-sm font-medium`}>
            <Clock className="w-4 h-4 mr-2" />
            {duration}
          </div>

          {/* Modules */}
          <div className="flex items-start space-x-2">
            <BookOpen className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 font-medium">{modules}</p>
          </div>

          {/* Diploma */}
          <div className="flex items-start space-x-2">
            <Award className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 font-medium">{diploma}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-600 text-sm">{feature1}</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-600 text-sm">{feature2}</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-auto">
          {id ? (
            <EnrollmentButton courseId={id} linkTo={linkTo} />
          ) : (
            <div className="w-full py-3 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
              Cours en préparation
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormationCard;
