import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Code2, Building2, Landmark, Briefcase, TrendingUp } from 'lucide-react';

const AVSCareers = () => {
  const aiCareers = {
    private: [
      { title: "Développeur en intelligence artificielle", salary: "8 000-16 000 MAD" },
      { title: "Analyste de données", salary: "6 000-12 000 MAD" },
      { title: "Ingénieur en apprentissage automatique", salary: "10 000-18 000 MAD" },
      { title: "Consultant en solutions intelligentes", salary: "12 000-20 000 MAD" }
    ],
    public: [
      { title: "Technicien au ministère de la Numérisation", salary: "Selon grille publique" },
      { title: "Analyste de données gouvernementales", salary: "Selon grille publique" },
      { title: "Développeur de systèmes intelligents", salary: "Selon grille publique" },
      { title: "Consultant technique", salary: "Selon grille publique" }
    ],
    freelance: [
      { title: "Consultant en intelligence artificielle", salary: "500-2000 MAD/jour" },
      { title: "Développeur de solutions sur mesure", salary: "300-1500 MAD/jour" },
      { title: "Formateur technique", salary: "200-800 MAD/heure" },
      { title: "Analyste de données indépendant", salary: "400-1200 MAD/jour" }
    ]
  };

  const programmingCareers = {
    private: [
      { title: "Développeur web", salary: "6 000-14 000 MAD" },
      { title: "Développeur d'applications", salary: "7 000-15 000 MAD" },
      { title: "Ingénieur logiciel", salary: "8 000-16 000 MAD" },
      { title: "Développeur Full Stack", salary: "10 000-18 000 MAD" }
    ],
    public: [
      { title: "Développeur de systèmes gouvernementaux", salary: "Selon grille publique" },
      { title: "Technicien au ministère de la Numérisation", salary: "Selon grille publique" },
      { title: "Développeur de sites officiels", salary: "Selon grille publique" },
      { title: "Administrateur systèmes", salary: "Selon grille publique" }
    ],
    freelance: [
      { title: "Développeur de sites indépendant", salary: "200-1000 MAD/jour" },
      { title: "Développeur d'applications mobiles", salary: "300-1200 MAD/jour" },
      { title: "Consultant technique", salary: "400-1500 MAD/jour" },
      { title: "Formateur en programmation", salary: "150-600 MAD/heure" }
    ]
  };

  const CareerSection = ({ title, icon: Icon, careers, color }) => (
    <Card className={`h-full bg-gradient-to-br from-${color}/5 to-${color}/10 border-${color}/20`}>
      <CardHeader>
        <CardTitle className={`flex items-center text-${color}`}>
          <Icon className="w-6 h-6 mr-3" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {careers.map((career, index) => (
          <div key={index} className="p-3 bg-white/60 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-1">{career.title}</h4>
            <Badge variant="outline" className={`text-${color} border-${color}/30 text-xs`}>
              {career.salary}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <SectionWrapper background="gray" padding="xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Badge variant="outline" className="mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-academy-blue/10 text-academy-blue border-academy-blue/30">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Opportunités de Carrière
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Votre Avenir Professionnel
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 sm:mb-8">
            Explorez les nombreuses opportunités qui s'offriront à vous après votre formation
          </p>
          
          {/* Success Statistics */}
          <div className="bg-gradient-to-r from-academy-blue/10 via-academy-purple/10 to-academy-lightblue/10 rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 border-2 border-academy-blue/20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
              Statistique Encourageante
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              <span className="font-bold text-academy-blue">95%</span> de nos diplômés trouvent un emploi dans les <span className="font-bold text-academy-purple">6 mois</span> avec un salaire moyen de <span className="font-bold text-academy-lightblue">8,000-16,000 MAD</span>
            </p>
          </div>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 sm:mb-12 h-12 sm:h-16 mx-4 sm:mx-0">
            <TabsTrigger value="ai" className="text-sm sm:text-lg py-2 sm:py-4 data-[state=active]:bg-academy-blue data-[state=active]:text-white">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Métiers Technicien IA</span>
              <span className="sm:hidden">TS IA</span>
            </TabsTrigger>
            <TabsTrigger value="programming" className="text-sm sm:text-lg py-2 sm:py-4 data-[state=active]:bg-academy-purple data-[state=active]:text-white">
              <Code2 className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Métiers Technicien Programmation</span>
              <span className="sm:hidden">TS Prog</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
              <CareerSection 
                title="Secteur Privé" 
                icon={Building2} 
                careers={aiCareers.private}
                color="academy-blue"
              />
              <CareerSection 
                title="Secteur Public" 
                icon={Landmark} 
                careers={aiCareers.public}
                color="academy-purple"
              />
              <CareerSection 
                title="Travail Indépendant" 
                icon={Briefcase} 
                careers={aiCareers.freelance}
                color="academy-lightblue"
              />
            </div>
          </TabsContent>

          <TabsContent value="programming" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CareerSection 
                title="Secteur Privé" 
                icon={Building2} 
                careers={programmingCareers.private}
                color="academy-blue"
              />
              <CareerSection 
                title="Secteur Public" 
                icon={Landmark} 
                careers={programmingCareers.public}
                color="academy-purple"
              />
              <CareerSection 
                title="Travail Indépendant" 
                icon={Briefcase} 
                careers={programmingCareers.freelance}
                color="academy-lightblue"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SectionWrapper>
  );
};

export default AVSCareers;