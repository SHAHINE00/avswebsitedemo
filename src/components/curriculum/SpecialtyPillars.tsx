
import React from 'react';
import { useSafeState } from '@/utils/safeHooks';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Code, Megaphone } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import CourseDetailModal from './CourseDetailModal';
import type { Course } from '@/hooks/useCourses';

const SpecialtyPillars: React.FC = () => {
  const { courses, loading, error, retry } = useCourses();
  const [selectedCourse, setSelectedCourse] = useSafeState<Course | null>(null);

  // Improved course categorization based on exact recommendations
  const aiCourses = courses.filter(course => {
    const title = course.title.toLowerCase();
    
    // Exact title matches for AI & Data Science
    const exactMatches = [
      'formation ia',
      'ai & machine learning engineering',
      'business intelligence',
      'ai for business',
      'ai for decision making',
      'computer vision with opencv',
      'ethical ai & governance',
      'data science for business',
      'data science with scikit-learn',
      'ai applications in industries',
      'financial data analysis',
      'python for ai & programming' // cross-listed foundation course
    ];
    
    if (exactMatches.some(match => title.includes(match))) {
      return true;
    }
    
    // Additional keyword matching for AI & Data Science
    return title.includes('ia') || 
           title.includes('intelligence artificielle') ||
           title.includes('machine learning') ||
           title.includes('deep learning') ||
           title.includes('computer vision') ||
           title.includes('opencv') ||
           title.includes('ethical ai') ||
           title.includes('scikit-learn') ||
           // Data science specific (not just any data course)
           (title.includes('data science') || (title.includes('data') && title.includes('science'))) ||
           // Financial data analysis
           (title.includes('financial') && title.includes('data'));
  });

  const programmingCourses = courses.filter(course => {
    const title = course.title.toLowerCase();
    
    // Exact title matches for Programming & Infrastructure
    const exactMatches = [
      'formation programmation',
      'python for ai & programming', // cross-listed foundation course
      'advanced python programming',
      'web development (html, css, js)',
      'mobile app development',
      'database design & management',
      'cloud computing (aws, azure)',
      'internet of things (iot)',
      'blockchain & cryptocurrency',
      'formation cybersécurité' // keeping in programming for now
    ];
    
    if (exactMatches.some(match => title.includes(match))) {
      return true;
    }
    
    // Additional keyword matching for Programming & Infrastructure
    return title.includes('programmation') ||
           title.includes('développement') ||
           title.includes('programming') ||
           title.includes('web development') ||
           title.includes('mobile app') ||
           title.includes('database') ||
           title.includes('cloud computing') ||
           title.includes('devops') ||
           title.includes('blockchain') ||
           title.includes('iot') ||
           title.includes('internet of things') ||
           title.includes('cybersécurité') ||
           title.includes('cybersecurity') ||
           // Programming languages for general programming (not AI-specific context)
           (title.includes('python') && title.includes('advanced') && title.includes('programming')) ||
           // Web technologies
           (title.includes('html') || title.includes('css') || title.includes('javascript') || title.includes('js'));
  });

  const marketingCourses = courses.filter(course => {
    const title = course.title.toLowerCase();
    
    // Exact title matches for Marketing Digital & Créatif
    const exactMatches = [
      'ai-powered digital marketing',
      'e-commerce marketing',
      'video production & ai editing',
      'social media content creation',
      'google data studio analytics',
      'data analysis with microsoft excel' // business/marketing analytics tool
    ];
    
    if (exactMatches.some(match => title.includes(match))) {
      return true;
    }
    
    // Additional keyword matching for Marketing Digital & Créatif
    return title.includes('marketing') ||
           title.includes('e-commerce') ||
           title.includes('digital marketing') ||
           title.includes('social media') ||
           title.includes('video production') ||
           title.includes('content creation') ||
           title.includes('design') ||
           title.includes('créatif') ||
           title.includes('graphique') ||
           // Business tools for marketing/business use
           title.includes('excel') ||
           title.includes('google data studio') ||
           // Creative and design tools
           title.includes('photoshop') ||
           title.includes('illustrator') ||
           title.includes('canva') ||
           // Business and entrepreneurship (not technical/data analysis)
           (title.includes('business') && !title.includes('intelligence') && !title.includes('data'));
  });

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 mb-4">Erreur lors du chargement des formations</p>
          <button 
            onClick={retry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
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
