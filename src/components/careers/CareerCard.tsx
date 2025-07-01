
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building, LucideIcon } from 'lucide-react';

export interface Career {
  title: string;
  salary: string;
  level: string;
  description: string;
  skills: string[];
  growth: string;
  companies: string[];
  experience: string;
  icon: LucideIcon;
  applications: string[];
}

interface CareerCardProps {
  career: Career;
  colorScheme: 'blue' | 'purple';
}

const CareerCard: React.FC<CareerCardProps> = ({ career, colorScheme }) => {
  const IconComponent = career.icon;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const colorClasses = {
    blue: {
      border: 'border-academy-blue/20 hover:border-academy-blue/40',
      iconBg: 'bg-academy-blue/10',
      iconColor: 'text-academy-blue',
      titleColor: 'text-academy-blue group-hover:text-academy-purple',
      salaryBg: 'bg-academy-blue/10',
      salaryColor: 'text-academy-blue',
      applicationsBg: 'bg-academy-blue/10',
      applicationsColor: 'text-academy-blue'
    },
    purple: {
      border: 'border-academy-purple/20 hover:border-academy-purple/40',
      iconBg: 'bg-academy-purple/10',
      iconColor: 'text-academy-purple',
      titleColor: 'text-academy-purple group-hover:text-academy-blue',
      salaryBg: 'bg-academy-purple/10',
      salaryColor: 'text-academy-purple',
      applicationsBg: 'bg-academy-purple/10',
      applicationsColor: 'text-academy-purple'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 ${colors.border}`}>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className={`${colors.iconBg} p-2 rounded-lg`}>
              <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
            </div>
            <div>
              <CardTitle className={`text-xl ${colors.titleColor} transition-colors`}>
                {career.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(career.level)}`}>
                  {career.level}
                </span>
                <span className="text-sm text-gray-600">{career.experience}</span>
              </div>
            </div>
          </div>
          <div className={`${colors.salaryBg} ${colors.salaryColor} px-3 py-1 rounded-full text-sm font-semibold`}>
            {career.salary}
          </div>
        </div>
        <CardDescription className="text-gray-700">
          {career.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Compétences clés:</h4>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill, skillIndex) => (
                <span key={skillIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Applications:</h4>
            <div className="flex flex-wrap gap-2">
              {career.applications.map((app, appIndex) => (
                <span key={appIndex} className={`${colors.applicationsBg} ${colors.applicationsColor} px-2 py-1 rounded-md text-sm`}>
                  {app}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{career.growth}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">{career.companies.length} entreprises</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerCard;
