
import React from 'react';
import { BookOpen, Target, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PresentationSection = () => {
  return (
    <section id="presentation" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Présentation du Programme</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Programme Professionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                Formation complète en Intelligence Artificielle conçue pour développer une expertise technique 
                et pratique dans les technologies IA les plus avancées du marché.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Objectifs de Formation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                Former des spécialistes capables de concevoir, développer et déployer des solutions IA 
                innovantes répondant aux défis technologiques actuels et futurs.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                Compétences Acquises
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                Maîtrise complète des outils et techniques : Python, ML/DL, traitement de données, 
                déploiement cloud et gestion de projets IA.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Public Cible
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                Professionnels en reconversion, ingénieurs, étudiants diplômés et passionnés de technologie 
                souhaitant se spécialiser en IA.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
