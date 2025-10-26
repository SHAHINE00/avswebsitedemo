
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Quelles formations proposez-vous à AVS INSTITUTE ?",
    answer: "Nous proposons trois piliers de spécialisation professionnelle : IA & Data Science (Intelligence Artificielle, Machine Learning, Data Analysis), Programmation & Infrastructure (Développement Full-Stack, DevOps, Cloud Computing), et Marketing Digital & Créatif (Digital Marketing, UX/UI Design, Content Creation). Chaque pilier comprend des formations spécialisées et des micro-certifications."
  },
  {
    question: "Quelles sont les différences principales entre nos trois piliers ?",
    answer: "IA & Data Science se concentre sur l'intelligence artificielle, le machine learning et l'analyse de données avec Python, TensorFlow et outils de Big Data. Programmation & Infrastructure couvre le développement web/mobile, DevOps et architecture cloud avec les frameworks modernes. Marketing Digital & Créatif forme aux stratégies digitales, design UX/UI, création de contenu et marketing automation."
  },
  {
    question: "Ai-je besoin d'expérience préalable pour commencer ?",
    answer: "Non, nos formations sont conçues pour tous les niveaux. Pour l'IA & Data Science, des bases en mathématiques sont utiles mais nous proposons des modules de mise à niveau. Pour la Programmation & Infrastructure, nous partons des fondamentaux du code. Pour le Marketing Digital & Créatif, aucune expérience technique préalable n'est requise."
  },
  {
    question: "Est-il possible de suivre plusieurs spécialisations ou obtenir des micro-certifications ?",
    answer: "Absolument ! Nos parcours sont modulaires et flexibles. Vous pouvez obtenir des micro-certifications dans chaque pilier, combiner plusieurs spécialisations, ou suivre un parcours complet. Par exemple : commencer par la Programmation, puis vous spécialiser en IA ou ajouter des compétences en Marketing Digital selon vos objectifs professionnels."
  },
  {
    question: "Quelles sont les opportunités professionnelles après nos formations ?",
    answer: "IA & Data Science : Data Scientist, ML Engineer, AI Consultant, Data Analyst. Programmation & Infrastructure : Développeur Full-Stack, DevOps Engineer, Cloud Architect, Tech Lead. Marketing Digital & Créatif : Digital Marketing Manager, UX/UI Designer, Content Strategist, Social Media Manager, Growth Hacker. Salaires moyens : 35K€ à 65K€ selon la spécialisation."
  },
  {
    question: "Les formations sont-elles reconnues et certifiantes ?",
    answer: "Oui, toutes nos formations sont reconnues par l'État et délivrent des certifications internationales. Nous sommes partenaires des plus grandes universités (Harvard, MIT, Stanford) et entreprises technologiques (Google, Microsoft, IBM) qui reconnaissent nos diplômes. Nos étudiants bénéficient d'un taux d'employabilité de plus de 90% dans les 6 mois suivant l'obtention du diplôme."
  },
  {
    question: "Quelle est la durée et le format des formations ?",
    answer: "Les durées varient selon le pilier : IA & Data Science (18 mois), Programmation & Infrastructure (24 semaines intensives), Marketing Digital & Créatif (12 mois). Toutes combinent théorie approfondie (40%) et pratique intensive (60%) avec des projets réels. Format hybride disponible : présentiel pour les travaux pratiques et distanciel pour certains cours théoriques."
  },
  {
    question: "Qu'est-ce qui distingue votre pilier Marketing Digital & Créatif ?",
    answer: "Notre pilier Marketing Digital & Créatif forme aux métiers d'avenir du marketing numérique : stratégies digitales, UX/UI design, création de contenu, marketing automation, analytics et growth hacking. Les formations incluent des outils professionnels (Adobe Creative Suite, Google Analytics, HubSpot) et des projets réels avec des entreprises partenaires."
  },
  {
    question: "Quels sont les prérequis techniques et le matériel nécessaire ?",
    answer: "Niveau Bac ou équivalent recommandé. Ordinateur personnel requis (specifications fournies selon la formation). Accès internet stable. Pour l'IA & Data Science, nous fournissons l'accès aux plateformes cloud et GPU. Pour le Marketing Digital, tous les logiciels et licences professionnelles sont inclus dans la formation."
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text">Questions fréquentes</h2>
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
