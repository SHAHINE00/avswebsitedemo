
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Code, Megaphone } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import CourseDetailModal from './CourseDetailModal';
import type { Course } from '@/hooks/useCourses';

const SpecialtyPillars: React.FC = () => {
  const { courses, loading } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Organize courses into 3 pillars
  const aiCourses = courses.filter(course => 
    course.title.toLowerCase().includes('ia') || 
    course.title.toLowerCase().includes('intelligence') ||
    course.title.toLowerCase().includes('data') ||
    course.title.toLowerCase().includes('python') ||
    course.title.toLowerCase().includes('machine') ||
    course.title.toLowerCase().includes('ai')
  );

  const programmingCourses = courses.filter(course => 
    course.title.toLowerCase().includes('web') ||
    course.title.toLowerCase().includes('mobile') ||
    course.title.toLowerCase().includes('cloud') ||
    course.title.toLowerCase().includes('blockchain') ||
    course.title.toLowerCase().includes('database') ||
    course.title.toLowerCase().includes('iot') ||
    course.title.toLowerCase().includes('excel') ||
    course.title.toLowerCase().includes('studio')
  );

  const marketingCourses = courses.filter(course => 
    course.title.toLowerCase().includes('marketing') ||
    course.title.toLowerCase().includes('e-commerce') ||
    course.title.toLowerCase().includes('video') ||
    course.title.toLowerCase().includes('social') ||
    course.title.toLowerCase().includes('financial')
  );

  const pillars = [
    {
      title: "Intelligence Artificielle & Data Science",
      icon: Brain,
      courses: aiCourses,
      gradient: "from-academy-blue to-academy-purple",
      bgColor: "bg-blue-50",
      borderColor: "border-academy-blue"
    },
    {
      title: "Programmation & Infrastructure",
      icon: Code,
      courses: programmingCourses,
      gradient: "from-academy-purple to-academy-lightblue",
      bgColor: "bg-purple-50",
      borderColor: "border-academy-purple"
    },
    {
      title: "Marketing Digital & Créatif",
      icon: Megaphone,
      courses: marketingCourses,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-10">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-96 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-10">
        {pillars.map((pillar, index) => (
          <Card key={index} className={`${pillar.bgColor} ${pillar.borderColor} border-2 hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-8">
              {/* Pillar Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mx-auto mb-4`}>
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <div className={`w-16 h-1 bg-gradient-to-r ${pillar.gradient} mx-auto rounded-full`}></div>
              </div>

              {/* Course List */}
              <div className="space-y-3">
                {pillar.courses.slice(0, 9).map((course, courseIndex) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="text-left flex-1 text-sm text-gray-700 hover:text-academy-purple transition-colors duration-200 font-medium hover:underline"
                    >
                      {courseIndex + 1}. {course.title}
                    </button>
                  </div>
                ))}
                
                {pillar.courses.length > 9 && (
                  <div className="text-center pt-4">
                    <span className="text-sm text-gray-500 font-medium">
                      +{pillar.courses.length - 9} autres programmes
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Programmes:</span>
                  <span className="font-semibold text-gray-900">{pillar.courses.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal 
        course={selectedCourse} 
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
};

export default SpecialtyPillars;
