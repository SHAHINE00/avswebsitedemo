
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const pricingPlans = [
  {
    name: "Essentiel",
    price: "499€",
    description: "Idéal pour débuter et découvrir les principes fondamentaux de l’IA.",
    features: [
      "Accès au cours 6 mois",
      "Modules fondamentaux",
      "Forum communautaire",
      "Sessions questions/réponses mensuelles",
      "Certificat numérique"
    ],
    buttonText: "Commencer",
    isPopular: false
  },
  {
    name: "Professionnel",
    price: "999€",
    description: "Notre plan le plus populaire pour accélérer votre carrière en IA.",
    features: [
      "Accès à vie",
      "Tous les modules",
      "Mentorat individuel",
      "Support prioritaire",
      "Évaluation de projets",
      "Aide à l’insertion professionnelle",
      "Certification reconnue"
    ],
    buttonText: "S'inscrire",
    isPopular: true
  },
  {
    name: "Entreprise",
    price: "Contactez-nous",
    description: "Solutions personnalisées pour équipes et organisations.",
    features: [
      "Programme sur mesure",
      "Formateur dédié",
      "Outils collaboratifs",
      "Suivi de progression",
      "Plateforme en marque blanche",
      "Rapports d’entreprise",
      "Tarifs préférentiels"
    ],
    buttonText: "Demander un devis",
    isPopular: false
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Formules adaptées à vos besoins</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choisissez le plan adapté à vos objectifs et à votre budget. Tous incluent le socle fondamental IA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
                plan.isPopular ? 'border-2 border-academy-blue ring-4 ring-academy-blue/20' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-academy-blue text-white py-1 px-4 font-medium text-sm transform translate-x-6 rotate-45 origin-bottom-left">
                    Populaire
                  </div>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Contactez-nous" && <span className="text-gray-600"> / paiement unique</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full py-6 text-lg ${
                    plan.isPopular 
                      ? 'bg-academy-blue hover:bg-academy-purple' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Besoin d’aide pour choisir ? <a href="#" className="text-academy-blue font-medium hover:underline">Contactez nos conseillers</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
