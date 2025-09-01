import React from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, CheckCircle, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVSInvestment = () => {
  const included = [
    "Toutes les matières éducatives",
    "Accès aux plateformes cloud",
    "Certifications internationales et nationales",
    "Support technique continu",
    "Suivi post-diplôme d'un an complet",
    "Opportunités d'emploi exclusives"
  ];

  const requirements = [
    "Titulaire d'un baccalauréat ou équivalent",
    "Passion pour la technologie et l'innovation",
    "Volonté d'apprendre et de se développer en continu",
    "Aucune expérience préalable en programmation n'est requise"
  ];

  const targetAudience = [
    "Diplômés du secondaire intéressés par la technologie",
    "Employés cherchant à développer leurs compétences",
    "Entrepreneurs intéressés par les technologies modernes",
    "Toute personne souhaitant changer de carrière"
  ];

  return (
    <SectionWrapper background="white" padding="md">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Badge variant="outline" className="mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-academy-blue/10 text-academy-blue border-academy-blue/30">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Investissement Formation
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Investissement & Options de Paiement
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Un investissement intelligent dans votre avenir professionnel avec des options de paiement flexibles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 px-4 sm:px-0">
          {/* Pricing Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-academy-blue/5 via-academy-purple/5 to-academy-lightblue/5 border-2 border-academy-blue/20">
            <div className="absolute top-0 right-0 bg-academy-blue text-white px-3 sm:px-6 py-1 sm:py-2 rounded-bl-2xl">
              <span className="font-semibold text-xs sm:text-sm">Meilleure Valeur</span>
            </div>
            <CardHeader className="pb-4 sm:pb-6 pt-8 sm:pt-12">
              <CardTitle className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-academy-blue/20 p-3 sm:p-4 rounded-2xl">
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-academy-blue" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                  Plan de Formation Complet
                </h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="bg-academy-blue/10 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-700">Frais d'inscription</span>
                    <span className="text-xl sm:text-2xl font-bold text-academy-blue">1,000 MAD</span>
                  </div>
                </div>
                
                <div className="bg-academy-purple/10 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-700">Versement mensuel</span>
                    <span className="text-xl sm:text-2xl font-bold text-academy-purple">1,400 MAD</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">× 20 mois</div>
                </div>
                
                <div className="bg-academy-lightblue/10 rounded-xl p-4 sm:p-6 border-2 border-academy-lightblue/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-base sm:text-lg font-semibold text-gray-800">Investissement total</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-academy-lightblue">29,000 MAD</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 sm:pt-4">
                <Button asChild className="w-full h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue hover:opacity-90">
                  <Link to="/register">S'inscrire Maintenant</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl text-gray-800">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0 text-academy-blue" />
                Ce que l'investissement comprend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {included.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-academy-blue/5 rounded-lg">
                  <div className="bg-academy-blue/20 p-1 rounded-full mt-1 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-academy-blue" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{item}</span>
                </div>
              ))}
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-academy-blue/10 to-academy-purple/10 rounded-xl border border-academy-blue/20">
                <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-2">Valeur Exceptionnelle</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Formation équivalente à un master technique, avec certification internationale, 
                  pour moins du coût d'une année universitaire classique.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
          {/* Requirements */}
          <Card className="bg-gradient-to-br from-academy-purple/5 to-academy-purple/10 border-academy-purple/20">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl text-academy-purple">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0" />
                Qualifications Requises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-academy-purple rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{req}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card className="bg-gradient-to-br from-academy-lightblue/5 to-academy-lightblue/10 border-academy-lightblue/20">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center text-xl sm:text-2xl text-academy-lightblue">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mr-0 sm:mr-3 mb-2 sm:mb-0 flex-shrink-0" />
                Publics Cibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {targetAudience.map((audience, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                  <div className="w-2 h-2 bg-academy-lightblue rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-gray-700">{audience}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AVSInvestment;