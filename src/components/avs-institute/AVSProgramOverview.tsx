import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Code2, CheckCircle, Users, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVSProgramOverview = () => {
  const highlights = [
    {
      icon: CheckCircle,
      title: "Diplôme reconnu par l'État",
      description: "Certification officielle de Technicien Spécialisé niveau Bac+2"
    },
    {
      icon: TrendingUp,
      title: "Deux spécialisations techniques",
      description: "Intelligence Artificielle et Programmation - technologies d'avenir"
    },
    {
      icon: Users,
      title: "Formation pratique intensive",
      description: "70% pratique, 30% théorie avec projets réels d'entreprise"
    },
    {
      icon: Shield,
      title: "Certifications internationales reconnues",
      description: "IBM, Microsoft Azure, Google Cloud, AWS, Meta et autres certifications mondiales"
    }
  ];

  return (
    <SectionWrapper background="white" padding="xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Badge variant="outline" className="mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-academy-blue/10 text-academy-blue border-academy-blue/30">
            🎓 Formation Technique Diplômante
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Diplôme de Technicien Spécialisé
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Formation technique de niveau Bac+2 reconnue par l'État marocain avec deux spécialisations de pointe : 
            <span className="font-semibold text-academy-blue"> Intelligence Artificielle</span> et 
            <span className="font-semibold text-academy-purple"> Programmation</span>
          </p>
        </div>

        {/* Key Features of Technical Degree */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4 sm:px-0">
          <div className="text-center p-4 bg-gradient-to-br from-academy-blue/10 to-academy-blue/20 rounded-xl border border-academy-blue/30">
            <div className="text-xl sm:text-2xl font-bold text-academy-blue mb-2">Bac+2</div>
            <div className="text-sm text-gray-700">Niveau technique reconnu</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-academy-purple/10 to-academy-purple/20 rounded-xl border border-academy-purple/30">
            <div className="text-xl sm:text-2xl font-bold text-academy-purple mb-2">OFPPT</div>
            <div className="text-sm text-gray-700">Certification officielle</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl border border-orange-300">
            <div className="text-xl sm:text-2xl font-bold text-orange-700 mb-2">8+ CERTIF.</div>
            <div className="text-sm text-gray-700">Certifications internationales</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl border border-green-300">
            <div className="text-xl sm:text-2xl font-bold text-green-700 mb-2">2 ANS</div>
            <div className="text-sm text-gray-700">Durée formation</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-academy-blue/20 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-academy-blue/10 p-2 sm:p-3 rounded-xl group-hover:bg-academy-blue group-hover:text-white transition-colors duration-300 flex-shrink-0">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-academy-blue group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">
                        {highlight.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-academy-blue/5 to-academy-blue/10 border-academy-blue/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                <div className="bg-academy-blue/20 p-3 sm:p-4 rounded-2xl mr-0 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-academy-blue" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
                    Technicien Spécialisé en IA
                  </h3>
                  <Badge className="bg-academy-blue/10 text-academy-blue text-xs mt-1">Bac+2 Reconnu État</Badge>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Formation technique spécialisée en développement de solutions d'intelligence artificielle, 
                machine learning et analyse de données pour l'industrie 4.0
              </p>
              <Button asChild className="w-full h-12 sm:h-auto bg-academy-blue hover:bg-academy-blue/90">
                <Link to="/register">Formation Technicien IA</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-academy-purple/5 to-academy-purple/10 border-academy-purple/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                <div className="bg-academy-purple/20 p-3 sm:p-4 rounded-2xl mr-0 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0">
                  <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-academy-purple" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                    Technicien Spécialisé en Programmation
                  </h3>
                  <Badge className="bg-academy-purple/10 text-academy-purple text-xs mt-1">Bac+2 Reconnu État</Badge>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Formation technique complète en développement logiciel, applications web et mobiles 
                avec les technologies modernes les plus demandées sur le marché
              </p>
              <Button asChild className="w-full h-12 sm:h-auto bg-academy-purple hover:bg-academy-purple/90">
                <Link to="/register">Formation Technicien Programmation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Relationship Between Specializations */}
        <div className="mt-12 sm:mt-16 px-4 sm:px-0">
          <Card className="bg-gradient-to-r from-academy-blue/5 via-white to-academy-purple/5 border-2 border-academy-blue/20">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                  Pourquoi ces deux spécialisations sont-elles complémentaires ?
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <div className="bg-academy-blue/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-academy-blue" />
                  </div>
                  <h4 className="font-bold text-academy-blue mb-2">IA</h4>
                  <p className="text-sm text-gray-600">Crée des systèmes intelligents</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Synergie</h4>
                  <p className="text-sm text-gray-600">L'IA nécessite une programmation solide pour être déployée</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-academy-purple/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Code2 className="w-8 h-8 text-academy-purple" />
                  </div>
                  <h4 className="font-bold text-academy-purple mb-2">Programmation</h4>
                  <p className="text-sm text-gray-600">Développe les applications qui utilisent l'IA</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/60 rounded-xl border border-academy-blue/20">
                <p className="text-center text-sm sm:text-base text-gray-700">
                  <span className="font-semibold">Les deux formations vous préparent aux métiers de demain</span> où la programmation et l'IA convergent 
                  pour créer des solutions innovantes dans tous les secteurs d'activité.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AVSProgramOverview;