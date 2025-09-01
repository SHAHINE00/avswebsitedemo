import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, FileText, Calendar, HandHeart, Building2, UserCheck, Network } from 'lucide-react';

const AVSSupport = () => {
  const professionalSupport = [
    {
      icon: Calendar,
      title: "Suivi d'un an complet",
      description: "Accompagnement personnalisé pendant 12 mois après votre diplôme"
    },
    {
      icon: FileText,
      title: "Aide à la préparation du CV",
      description: "Optimisation de votre profil professionnel pour le marché"
    },
    {
      icon: UserCheck,
      title: "Formation aux entretiens",
      description: "Préparation complète aux entretiens d'embauche"
    },
    {
      icon: Network,
      title: "Réseau d'anciens élèves",
      description: "Connexion avec plus de 500 professionnels du secteur"
    }
  ];

  const employmentOpportunities = [
    {
      icon: Building2,
      title: "Partenariats avec +50 entreprises",
      description: "Accès privilégié aux offres d'emploi de nos partenaires"
    },
    {
      icon: Users,
      title: "Salons de l'emploi exclusifs",
      description: "Événements de recrutement dédiés à nos diplômés"
    },
    {
      icon: Briefcase,
      title: "Programme de stages coopératifs",
      description: "Stages rémunérés pendant et après la formation"
    },
    {
      icon: HandHeart,
      title: "Support pour projets indépendants",
      description: "Accompagnement pour créer votre propre entreprise"
    }
  ];

  return (
    <SectionWrapper background="gray" padding="xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Badge variant="outline" className="mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-academy-purple/10 text-academy-purple border-academy-purple/30">
            <HandHeart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Support Post-Diplôme
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Support Après l'Obtention du Diplôme
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Notre engagement ne s'arrête pas à votre diplôme. Nous vous accompagnons dans votre insertion professionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 px-4 sm:px-0">
          {/* Professional Support */}
          <Card className="bg-gradient-to-br from-academy-blue/5 to-academy-blue/10 border-academy-blue/20">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl text-academy-blue">
                <div className="bg-academy-blue/20 p-2 sm:p-3 rounded-xl mr-0 sm:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-academy-blue" />
                </div>
                Support Professionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {professionalSupport.map((support, index) => {
                const Icon = support.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-lg border border-academy-blue/10">
                    <div className="bg-academy-blue/20 p-1.5 sm:p-2 rounded-lg mt-1 flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-academy-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">{support.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{support.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Employment Opportunities */}
          <Card className="bg-gradient-to-br from-academy-purple/5 to-academy-purple/10 border-academy-purple/20">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl text-academy-purple">
                <div className="bg-academy-purple/20 p-2 sm:p-3 rounded-xl mr-0 sm:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-academy-purple" />
                </div>
                Opportunités d'Emploi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {employmentOpportunities.map((opportunity, index) => {
                const Icon = opportunity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/60 rounded-lg border border-academy-purple/10">
                    <div className="bg-academy-purple/20 p-1.5 sm:p-2 rounded-lg mt-1 flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-academy-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1">{opportunity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{opportunity.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Success Statistics */}
        <Card className="bg-gradient-to-r from-academy-blue/10 via-academy-purple/10 to-academy-lightblue/10 border-2 border-academy-blue/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                Nos Résultats Parlent d'Eux-Mêmes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-academy-blue mb-2">95%</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Taux d'Emploi</div>
                  <div className="text-sm sm:text-base text-gray-600">En 6 mois maximum</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-academy-purple mb-2">500+</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Anciens Élèves</div>
                  <div className="text-sm sm:text-base text-gray-600">Dans notre réseau</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-academy-lightblue mb-2">12k</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Salaire Moyen</div>
                  <div className="text-sm sm:text-base text-gray-600">MAD par mois</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white/60 rounded-xl border border-academy-blue/20">
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  Témoignage de Succès
                </h4>
                <p className="text-gray-700 italic">
                  "Grâce au support post-diplôme d'AVS Innovation, j'ai décroché mon poste de développeur IA 
                  chez une startup tech en seulement 3 mois. Le réseau d'anciens et l'accompagnement personnalisé 
                  ont fait toute la différence."
                </p>
                <div className="mt-3 text-sm text-academy-blue font-semibold">
                  - Youssef M., Promotion 2023, Développeur IA
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default AVSSupport;