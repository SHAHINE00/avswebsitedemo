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
      title: "Aucune expérience préalable requise",
      description: "Nous commençons avec vous à partir de zéro !"
    },
    {
      icon: TrendingUp,
      title: "Taux d'emploi exceptionnel",
      description: "95% de nos diplômés trouvent un emploi dans les 6 mois"
    },
    {
      icon: Users,
      title: "Réseau professionnel solide",
      description: "Plus de 500 professionnels dans notre réseau d'anciens"
    },
    {
      icon: Shield,
      title: "Garantie de suivi",
      description: "Suivi complet d'un an après l'obtention du diplôme"
    }
  ];

  return (
    <SectionWrapper background="white" padding="xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 bg-academy-blue/10 text-academy-blue border-academy-blue/30">
            Programme d'Excellence
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Qu'est-ce que ce programme ?
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Un programme de formation complet de deux ans qui combine des connaissances théoriques 
            et des compétences pratiques dans les domaines technologiques les plus demandés sur le marché
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-academy-blue/20 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-academy-blue/10 p-3 rounded-xl group-hover:bg-academy-blue group-hover:text-white transition-colors duration-300">
                      <Icon className="w-8 h-8 text-academy-blue group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-academy-blue/5 to-academy-blue/10 border-academy-blue/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-academy-blue/20 p-4 rounded-2xl mr-4">
                  <Brain className="w-10 h-10 text-academy-blue" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
                  Intelligence Artificielle
                </h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Une spécialisation avancée axée sur le développement et l'application de solutions 
                d'intelligence artificielle dans divers domaines industriels et commerciaux
              </p>
              <Button asChild className="w-full bg-academy-blue hover:bg-academy-blue/90">
                <Link to="/register">Découvrir la spécialisation IA</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-academy-purple/5 to-academy-purple/10 border-academy-purple/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-academy-purple/20 p-4 rounded-2xl mr-4">
                  <Code2 className="w-10 h-10 text-academy-purple" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                  Programmation
                </h3>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Une spécialisation complète dans le développement de logiciels et d'applications web 
                en utilisant les dernières technologies et outils logiciels
              </p>
              <Button asChild className="w-full bg-academy-purple hover:bg-academy-purple/90">
                <Link to="/register">Découvrir la programmation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AVSProgramOverview;