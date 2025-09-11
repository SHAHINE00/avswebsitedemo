import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Globe, Briefcase } from 'lucide-react';

const CareerPaths: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Opportunités de Carrière
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les avantages de nos formations professionnelles reconnues
            </p>
          </div>
          
          {/* Top Benefits Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Formation reconnue par l'État
              </h3>
              <p className="text-gray-600">
                Certification officielle validée par les institutions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Certification internationale
              </h3>
              <p className="text-gray-600">
                Reconnaissance mondiale de vos compétences
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Métiers tech rémunérateurs
              </h3>
              <p className="text-gray-600">
                Accès aux emplois les mieux payés du secteur
              </p>
            </div>
          </div>
          
          {/* Career Specialties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* IA & Data Science */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">IA & Data Science</h3>
                <p className="text-gray-600 text-sm">Intelligence artificielle et analyse de données</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm">Data Scientist</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm">Ingénieur ML/IA</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm">Architecte IA</span>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 text-center font-semibold">
                €45k - €85k
              </div>
            </div>
            
            {/* Programmation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Programmation</h3>
                <p className="text-gray-600 text-sm">Développement web et mobile</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-sm">Développeur Full Stack</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-sm">Développeur Mobile</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-sm">Ingénieur DevOps</span>
                </div>
              </div>
              
              <div className="bg-green-50 text-green-700 rounded-lg px-4 py-2 text-center font-semibold">
                €40k - €75k
              </div>
            </div>

            {/* Marketing Digital */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing Digital</h3>
                <p className="text-gray-600 text-sm">Communication et créativité numérique</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-sm">Marketing Manager</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-sm">Community Manager</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-sm">Content Creator</span>
                </div>
              </div>
              
              <div className="bg-purple-50 text-purple-700 rounded-lg px-4 py-2 text-center font-semibold">
                €35k - €65k
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Link to="/careers">
                Découvrir toutes les opportunités
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;