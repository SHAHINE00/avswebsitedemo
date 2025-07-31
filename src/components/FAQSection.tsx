
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Quelles formations proposez-vous à AVS INSTITUTE ?",
    answer: "Nous proposons trois formations de pointe : Intelligence Artificielle (IA) avec machine learning et analyse de données, Programmation avec développement web/mobile/logiciel, et Cybersécurité avec ethical hacking et protection des systèmes. Chaque formation est conçue pour répondre aux besoins actuels du marché technologique."
  },
  {
    question: "Quelles sont les différences principales entre nos trois formations ?",
    answer: "La formation IA se concentre sur l'intelligence artificielle, le machine learning et l'analyse de données. La formation Programmation couvre le développement web, mobile et logiciel avec les frameworks modernes. La formation Cybersécurité forme aux techniques de protection, ethical hacking et sécurisation des systèmes informatiques."
  },
  {
    question: "Ai-je besoin d'expérience préalable pour commencer ?",
    answer: "Non, nos formations sont conçues pour accueillir tous les niveaux. Pour l'IA, des bases en mathématiques sont utiles mais nous proposons des modules de mise à niveau. Pour la Programmation, nous partons des fondamentaux. Pour la Cybersécurité, une compréhension de base de l'informatique est recommandée mais non obligatoire."
  },
  {
    question: "Est-il possible de suivre plusieurs formations ou de se spécialiser ?",
    answer: "Absolument ! Nous proposons des parcours combinés et des spécialisations. Vous pouvez commencer par la Programmation pour acquérir les bases techniques, puis vous spécialiser en IA ou Cybersécurité. Nos parcours sont flexibles et personnalisables selon vos objectifs professionnels."
  },
  {
    question: "Quelles sont les opportunités professionnelles après nos formations ?",
    answer: "Formation IA : Data Scientist, ML Engineer, AI Consultant, Analyst Data. Formation Programmation : Développeur Full-Stack, Mobile Developer, DevOps Engineer, Tech Lead. Formation Cybersécurité : Cybersecurity Analyst, Penetration Tester, Security Consultant, CISO. Toutes ouvrent vers des carrières hautement rémunérées."
  },
  {
    question: "Les formations sont-elles reconnues et certifiantes ?",
    answer: "Oui, toutes nos formations sont reconnues par l'État et délivrent des certifications internationales. Nous sommes partenaires d'entreprises technologiques majeures qui reconnaissent nos diplômes. Nos étudiants bénéficient d'un taux d'employabilité de plus de 90% dans les 6 mois suivant l'obtention du diplôme."
  },
  {
    question: "Quelle est la durée et le format des formations ?",
    answer: "Nos formations s'étendent sur 12 à 24 mois selon la spécialisation choisie. Elles combinent théorie approfondie (40%) et pratique intensive (60%) avec des projets réels. Format hybride disponible : présentiel pour les travaux pratiques et distanciel pour certains cours théoriques."
  },
  {
    question: "Quels sont les prérequis techniques et le matériel nécessaire ?",
    answer: "Niveau Bac ou équivalent recommandé. Ordinateur personnel requis (specifications fournies selon la formation). Accès internet stable. Pour la Cybersécurité, nous fournissons l'accès à des environnements de test sécurisés. Tous les logiciels et licences professionnelles sont inclus dans la formation."
  },
  {
    question: "Comment se déroule l'admission et y a-t-il une sélection ?",
    answer: "Processus d'admission en 3 étapes : 1) Candidature en ligne avec motivation, 2) Entretien individuel pour évaluer la motivation et les objectifs, 3) Test de logique (non éliminatoire, pour adaptation pédagogique). Nous privilégions la motivation et le projet professionnel à l'expérience technique préalable."
  },
  {
    question: "Proposez-vous un accompagnement pour l'insertion professionnelle ?",
    answer: "Oui, nous offrons un accompagnement complet : coaching CV/entretiens, mise en relation avec notre réseau de 200+ entreprises partenaires, sessions de networking, suivi post-diplôme pendant 12 mois. 90% de nos diplômés trouvent un emploi dans les 6 mois, avec un salaire moyen de 35K€ à 55K€ selon la spécialisation."
  },
  {
    question: "Quelles sont les modalités de financement disponibles ?",
    answer: "Plusieurs options : financement personnel avec facilités de paiement, CPF (Compte Personnel de Formation), alternance avec contrat pro/apprentissage, financement entreprise, prêts étudiants partenaires à taux préférentiels. Notre équipe vous accompagne pour identifier la meilleure solution selon votre situation."
  }
];

const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-academy-gray/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Questions fréquentes</h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Trouvez des réponses aux questions les plus courantes sur nos formations en IA, Programmation et Cybersécurité.
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
