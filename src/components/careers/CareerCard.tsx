
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building, LucideIcon, Award, Clock, BookOpen, Users } from 'lucide-react';

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
  certification: string;
  duration: string;
  modules: string;
  relatedCourses: string[];
  certifyingPartners: string[];
}

interface CareerCardProps {
  career: Career;
  colorScheme: 'blue' | 'purple' | 'green';
}

const CareerCard: React.FC<CareerCardProps> = ({ career, colorScheme }) => {
  const IconComponent = career.icon;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ": return "bg-green-100 text-green-800";
      case "متوسط": return "bg-yellow-100 text-yellow-800";
      case "متقدم": return "bg-red-100 text-red-800";
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
      applicationsColor: 'text-academy-blue',
      certificationBg: 'bg-academy-blue/5',
      certificationBorder: 'border-academy-blue/20',
      partnersBg: 'bg-academy-blue/10',
      partnersColor: 'text-academy-blue'
    },
    purple: {
      border: 'border-academy-purple/20 hover:border-academy-purple/40',
      iconBg: 'bg-academy-purple/10',
      iconColor: 'text-academy-purple',
      titleColor: 'text-academy-purple group-hover:text-academy-blue',
      salaryBg: 'bg-academy-purple/10',
      salaryColor: 'text-academy-purple',
      applicationsBg: 'bg-academy-purple/10',
      applicationsColor: 'text-academy-purple',
      certificationBg: 'bg-academy-purple/5',
      certificationBorder: 'border-academy-purple/20',
      partnersBg: 'bg-academy-purple/10',
      partnersColor: 'text-academy-purple'
    },
    green: {
      border: 'border-academy-lightblue/20 hover:border-academy-lightblue/40',
      iconBg: 'bg-academy-lightblue/10',
      iconColor: 'text-academy-lightblue',
      titleColor: 'text-academy-lightblue group-hover:text-academy-blue',
      salaryBg: 'bg-academy-lightblue/10',
      salaryColor: 'text-academy-lightblue',
      applicationsBg: 'bg-academy-lightblue/10',
      applicationsColor: 'text-academy-lightblue',
      certificationBg: 'bg-academy-lightblue/5',
      certificationBorder: 'border-academy-lightblue/20',
      partnersBg: 'bg-academy-lightblue/10',
      partnersColor: 'text-academy-lightblue'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 ${colors.border}`}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`${colors.iconBg} p-2 rounded-lg flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className={`text-lg sm:text-xl ${colors.titleColor} transition-colors leading-tight`}>
                {career.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(career.level)}`}>
                  {career.level}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">{career.experience}</span>
              </div>
            </div>
          </div>
          <div className={`${colors.salaryBg} ${colors.salaryColor} px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap`}>
            {career.salary}
          </div>
        </div>
        
        {/* International Certification Info */}
        <div className={`${colors.certificationBg} border ${colors.certificationBorder} rounded-lg p-3 sm:p-4 mb-3`}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Award className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconColor}`} />
            <span className="text-xs sm:text-sm font-bold text-gray-800">الشهادة الدولية</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium">{career.certification}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs text-gray-600 mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">المدة: {career.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{career.modules}</span>
            </div>
          </div>
          
          {/* Certifying Partners */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs text-gray-600 font-bold">الشركاء المعتمدون:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {career.certifyingPartners.map((partner, index) => (
                <span key={index} className={`${colors.partnersBg} ${colors.partnersColor} px-2 py-1 rounded-md text-xs font-bold border`}>
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>

        <CardDescription className="text-gray-700 text-sm">
          {career.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">المهارات الأساسية:</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {career.skills.map((skill, skillIndex) => (
                <span key={skillIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">التطبيقات:</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {career.applications.map((app, appIndex) => (
                <span key={appIndex} className={`${colors.applicationsBg} ${colors.applicationsColor} px-2 py-1 rounded-md text-xs font-medium`}>
                  {app}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t gap-2">
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs font-medium">{career.growth}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs">{career.companies.length} شركة</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerCard;
