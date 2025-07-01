
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Code, Database, Cloud, Target, Shield, type LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  brain: Brain,
  code: Code,
  database: Database,
  cloud: Cloud,
  target: Target,
  shield: Shield,
};

const GenericCourse = () => {
  const { slug } = useParams<{ slug: string }>();
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
            <p className="text-gray-600">Impossible de charger les cours: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Find the course by slug (extract slug from link_to)
  const course = courses.find(c => {
    if (!c.link_to) return false;
    const courseSlug = c.link_to.replace('/course/', '').replace(/^\//, '');
    return courseSlug === slug;
  });

  if (!course) {
    return <Navigate to="/404" replace />;
  }

  const IconComponent = iconMap[course.icon] || Brain;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-academy-blue to-academy-purple text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center mb-6">
              <IconComponent className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            {course.subtitle && (
              <p className="text-xl md:text-2xl mb-8 opacity-90">{course.subtitle}</p>
            )}
          </div>
        </section>

        {/* Course Details */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {course.modules && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Modules</h3>
                  <p className="text-gray-600">{course.modules}</p>
                </div>
              )}
              {course.duration && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Durée</h3>
                  <p className="text-gray-600">{course.duration}</p>
                </div>
              )}
              {course.diploma && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Certification</h3>
                  <p className="text-gray-600">{course.diploma}</p>
                </div>
              )}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Statut</h3>
                <p className="text-gray-600">Formation disponible</p>
              </div>
            </div>

            {/* Features Section */}
            {(course.feature1 || course.feature2) && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">Points Clés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {course.feature1 && (
                    <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">{course.feature1}</h3>
                      <p className="text-gray-600">
                        Maîtrisez les concepts fondamentaux et les applications pratiques de {course.feature1.toLowerCase()}.
                      </p>
                    </div>
                  )}
                  {course.feature2 && (
                    <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">{course.feature2}</h3>
                      <p className="text-gray-600">
                        Développez vos compétences en {course.feature2.toLowerCase()} avec des projets concrets.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center bg-gray-50 py-16 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Rejoignez notre programme de formation et développez vos compétences avec nos experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="bg-academy-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-academy-purple transition-colors inline-block"
                >
                  S'inscrire maintenant
                </a>
                <a 
                  href="/contact"
                  className="border border-academy-blue text-academy-blue px-8 py-3 rounded-lg font-semibold hover:bg-academy-blue hover:text-white transition-colors inline-block"
                >
                  Plus d'informations
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default GenericCourse;
