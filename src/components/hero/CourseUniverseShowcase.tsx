
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { Brain, Code, Palette, ChevronRight, Clock, BookOpen, Award } from 'lucide-react';

const CourseUniverseShowcase: React.FC = () => {
  const { courses, loading } = useCourses();
  const [activeTab, setActiveTab] = useState('ai');

  // Organize courses by specialty
  const organizedCourses = {
    ai: courses.filter(course => 
      course.title.toLowerCase().includes('ia') || 
      course.title.toLowerCase().includes('intelligence') ||
      course.title.toLowerCase().includes('data') ||
      course.title.toLowerCase().includes('machine') ||
      course.title.toLowerCase().includes('deep')
    ),
    programming: courses.filter(course => 
      course.title.toLowerCase().includes('programmation') ||
      course.title.toLowerCase().includes('développement') ||
      course.title.toLowerCase().includes('web') ||
      course.title.toLowerCase().includes('mobile') ||
      course.title.toLowerCase().includes('devops') ||
      course.title.toLowerCase().includes('cloud')
    ),
    marketing: courses.filter(course => 
      course.title.toLowerCase().includes('marketing') ||
      course.title.toLowerCase().includes('design') ||
      course.title.toLowerCase().includes('créatif') ||
      course.title.toLowerCase().includes('graphique')
    )
  };

  const specialties = [
    {
      id: 'ai',
      title: 'IA & Data Science',
      icon: Brain,
      gradient: 'from-academy-blue to-academy-purple',
      count: organizedCourses.ai.length,
      description: 'Intelligence Artificielle & Analyse de Données'
    },
    {
      id: 'programming',
      title: 'Programmation & Infrastructure',
      icon: Code,
      gradient: 'from-academy-purple to-academy-lightblue',
      count: organizedCourses.programming.length,
      description: 'Développement Web, Mobile & DevOps'
    },
    {
      id: 'marketing',
      title: 'Marketing Digital & Créatif',
      icon: Palette,
      gradient: 'from-academy-lightblue to-academy-blue',
      count: organizedCourses.marketing.length,
      description: 'Design, Marketing & Communication'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeCourses = organizedCourses[activeTab as keyof typeof organizedCourses] || [];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in" style={{animationDelay: '1.2s'}}>
      {/* Universe Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-text">Notre Univers de Formations</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Découvrez notre gamme complète de formations certifiées par les plus prestigieuses institutions
        </p>
      </div>

      {/* Specialty Tabs */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
        {specialties.map((specialty) => {
          const IconComponent = specialty.icon;
          return (
            <button
              key={specialty.id}
              onClick={() => setActiveTab(specialty.id)}
              className={`relative group p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 ${
                activeTab === specialty.id
                  ? 'bg-white/90 border-academy-blue/30 shadow-xl'
                  : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-academy-blue/20'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${specialty.gradient} opacity-5 rounded-2xl`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${specialty.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{specialty.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{specialty.description}</p>
                <div className="flex items-center justify-center">
                  <span className="bg-academy-blue/10 text-academy-blue px-3 py-1 rounded-full text-sm font-semibold">
                    {specialty.count} formations
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCourses.map((course, index) => (
          <Link
            key={course.id}
            to={course.link_to || `/course/${course.title.toLowerCase().replace(/\s+/g, '-')}`}
            className="group relative animate-fade-in"
            style={{animationDelay: `${1.4 + index * 0.1}s`}}
          >
            <div className="relative p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-academy-blue/30 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient_from} ${course.gradient_to} opacity-5 rounded-2xl`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient_from} ${course.gradient_to} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-academy-blue group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Course Title */}
                <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-academy-blue transition-colors duration-300 line-clamp-2">
                  {course.title}
                </h4>

                {/* Course Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  {course.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  )}
                  {course.modules && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.modules}</span>
                    </div>
                  )}
                </div>

                {/* Certification */}
                {course.certification_provider_name && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Award className="w-4 h-4 text-academy-blue" />
                    <span className="text-sm font-semibold text-academy-blue">
                      Certifié {course.certification_provider_name}
                    </span>
                  </div>
                )}

                {/* Features */}
                {(course.feature1 || course.feature2) && (
                  <div className="mt-3">
                    {course.feature1 && (
                      <div className="text-xs text-gray-600 mb-1">• {course.feature1}</div>
                    )}
                    {course.feature2 && (
                      <div className="text-xs text-gray-600">• {course.feature2}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '1.8s'}}>
        <p className="text-gray-600 mb-6">
          Plus de <span className="font-bold text-academy-blue">{courses.length} formations disponibles</span> avec des certifications prestigieuses
        </p>
        <Link
          to="/curriculum"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-purple hover:to-academy-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Voir toutes nos formations
          <ChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default CourseUniverseShowcase;
