import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { Brain, Code, Palette, ChevronRight, Clock, BookOpen, Award } from 'lucide-react';

const CourseUniverseShowcase: React.FC = () => {
  const { courses, loading } = useCourses();
  const [activeTab, setActiveTab] = useState('ai');

  // Improved course categorization based on exact recommendations
  const organizedCourses = {
    ai: courses.filter(course => {
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
    }),
    
    programming: courses.filter(course => {
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
    }),
    
    marketing: courses.filter(course => {
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
    })
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
            <Link
              key={specialty.id}
              to={
                specialty.id === 'ai' ? '/ai-course' :
                specialty.id === 'programming' ? '/programming-course' :
                '/curriculum'
              }
              className={`relative group p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 transform hover:scale-105 block ${
                activeTab === specialty.id
                  ? 'bg-white/90 border-academy-blue/30 shadow-xl'
                  : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-academy-blue/20'
              }`}
              onMouseEnter={() => setActiveTab(specialty.id)}
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
            </Link>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '1.8s'}}>
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
