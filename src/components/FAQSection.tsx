
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Quelles sont les différences principales entre les formations IA et Programmation ?",
    answer: "La formation IA se concentre sur l'intelligence artificielle, le machine learning et l'analyse de données, tandis que la formation Programmation couvre le développement web, mobile et logiciel. La formation IA nécessite des bases en mathématiques et statistiques, alors que la formation Programmation est plus axée sur les langages de programmation et les frameworks modernes."
  },
  {
    question: "Ai-je besoin d'expérience préalable en programmation pour suivre la formation IA ?",
    answer: "Une connaissance de base en programmation est recommandée pour la formation IA, mais nous proposons un module d'introduction pour les débutants. Si vous n'avez aucune expérience en programmation, vous pourriez envisager de commencer par notre formation Programmation avant de vous spécialiser en IA."
  },
  {
    question: "Est-il possible de suivre les deux formations ?",
    answer: "Absolument ! Nous proposons même un parcours combiné pour ceux qui souhaitent maîtriser à la fois la programmation et l'intelligence artificielle. Vous pouvez commencer par la formation en Programmation pour acquérir les bases, puis poursuivre avec la formation IA pour vous spécialiser."
  },
  {
    question: "Quelles sont les opportunités professionnelles après ces formations ?",
    answer: "Les diplômés de la formation IA peuvent travailler comme Data Scientists, ML Engineers ou AI Consultants, tandis que les diplômés de la formation Programmation peuvent devenir Développeurs Web, Mobile ou DevOps Engineers. Les deux formations ouvrent des portes vers des carrières bien rémunérées dans l'industrie technologique."
  },
  {
    question: "Les formations sont-elles reconnues par les employeurs ?",
    answer: "Oui, nos deux formations sont reconnues par l'État et incluent des certifications internationales. De plus, notre réseau de partenaires industriels reconnaît la qualité de notre enseignement et embauche régulièrement nos diplômés."
  },
  {
    question: "Quelle est la durée de chaque formation ?",
    answer: "Nos formations s'étendent sur une période de 2 ans, combinant enseignement théorique approfondi et application pratique par le biais de projets concrets. Cette durée optimale permet aux étudiants d'acquérir une maîtrise complète des compétences nécessaires pour exceller dans le secteur technologique, tout en développant un portfolio professionnel substantiel."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-16 bg-academy-gray/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Trouvez des réponses aux questions les plus courantes sur nos formations en IA et en Programmation.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
