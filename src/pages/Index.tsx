
import React from 'react';
import SEOHead from '@/components/SEOHead';
import OptimizedHomepage from '@/components/OptimizedHomepage';
import { pageSEO, generateFAQJsonLd, generateReviewJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from '@/utils/seoData';

const Index = () => {
  // Enhanced FAQ structured data for AEO/GEO/AIO optimization
  const faqJsonLd = generateFAQJsonLd([
    // Formation générale
    {
      question: "Quelles formations proposez-vous à AVS INSTITUTE ?",
      answer: "Nous proposons trois piliers de spécialisation : IA & Data Science (18 mois), Programmation & Infrastructure (24 semaines), et Marketing Digital & Créatif (12 mois) avec des certifications internationales Harvard, MIT, Stanford, Google, Microsoft et IBM."
    },
    {
      question: "Les formations AVS INSTITUTE sont-elles reconnues par l'État marocain ?",
      answer: "Oui, toutes nos formations sont reconnues par l'État marocain et délivrent des certifications internationales. Nous sommes accrédités par le Ministère de l'Éducation et nos diplômes sont validés pour l'insertion professionnelle au Maroc."
    },
    {
      question: "Combien coûtent les formations à AVS INSTITUTE ?",
      answer: "Nos tarifs varient selon la formation : IA & Data Science (45 000 MAD), Programmation (35 000 MAD), Marketing Digital (30 000 MAD). Facilités de paiement et bourses d'études disponibles."
    },
    {
      question: "Ai-je besoin d'expérience préalable pour intégrer AVS INSTITUTE ?",
      answer: "Non, nos formations accueillent tous les niveaux. Nous proposons des modules de mise à niveau inclus et un accompagnement personnalisé pour garantir votre réussite, même sans expérience technique préalable."
    },
    // Carrières et débouchés
    {
      question: "Quels sont les débouchés après une formation en IA à AVS INSTITUTE ?",
      answer: "Nos diplômés en IA deviennent : Data Scientist (15 000-25 000 MAD/mois), Ingénieur IA (18 000-30 000 MAD/mois), Consultant IA (20 000-35 000 MAD/mois). 85% trouvent un emploi en 6 mois."
    },
    {
      question: "Quel salaire espérer après une formation programmation chez AVS ?",
      answer: "Salaires moyens au Maroc après nos formations : Développeur Full Stack (12 000-20 000 MAD), DevOps Engineer (15 000-25 000 MAD), Architecte Logiciel (20 000-35 000 MAD). Évolution rapide selon l'expérience."
    },
    {
      question: "AVS INSTITUTE aide-t-il à trouver un emploi après la formation ?",
      answer: "Oui, nous avons un réseau de 200+ entreprises partenaires au Maroc. Service placement inclus : préparation CV, simulations d'entretiens, mise en relation directe avec les recruteurs, suivi post-formation."
    },
    // Modalités pratiques
    {
      question: "Où se déroulent les cours d'AVS INSTITUTE ?",
      answer: "Campus principal à Casablanca (Maarif) et centre à Rabat (Agdal). Formations aussi disponibles en ligne avec classes virtuelles interactives et accès 24/7 à la plateforme d'apprentissage."
    },
    {
      question: "Comment s'inscrire à AVS INSTITUTE ?",
      answer: "Inscription en ligne sur avs.ma, test de positionnement gratuit, entretien de motivation. Rentrées : septembre, janvier, avril. Places limitées, inscription recommandée 2 mois avant."
    },
    {
      question: "Quelles sont les conditions d'admission à AVS INSTITUTE ?",
      answer: "Baccalauréat ou équivalent, motivation pour les technologies, test de logique et entretien. Aucun prérequis technique spécifique. Nous évaluons surtout la motivation et les capacités d'apprentissage."
    },
    // Spécificités techniques
    {
      question: "Quels logiciels et technologies apprend-on chez AVS ?",
      answer: "IA : Python, TensorFlow, PyTorch, Jupyter, AWS ML. Programmation : JavaScript, React, Node.js, Docker, Kubernetes. Cybersécurité : Kali Linux, Wireshark, Metasploit, SIEM. Accès gratuit à tous les outils."
    },
    {
      question: "Les certifications AVS sont-elles reconnues par les entreprises ?",
      answer: "Oui, nos partenaires incluent : Harvard Extension School, Google Cloud, Microsoft Azure, IBM Watson, Amazon AWS. Ces certifications sont très recherchées par les employeurs tech au Maroc et à l'international."
    },
    // Support et accompagnement
    {
      question: "Quel est le taux de réussite des étudiants AVS INSTITUTE ?",
      answer: "95% de taux de réussite grâce à notre pédagogie adaptative, classes de 15 étudiants maximum, mentoring individuel, plateforme e-learning 24/7, et support technique permanent."
    },
    {
      question: "Y a-t-il un suivi après la formation chez AVS ?",
      answer: "Suivi à vie inclus : accès permanent aux mises à jour de contenu, réseau alumni, workshops mensuels, veille technologique, support carrière. Communauté active de 3000+ diplômés."
    },
    {
      question: "Peut-on faire une formation AVS en travaillant ?",
      answer: "Oui, nos formats flexibles s'adaptent : cours du soir (18h-21h), weekends, e-learning asynchrone. 70% de nos étudiants sont en activité. Planning personnalisable selon vos contraintes professionnelles."
    }
  ]);

  // Generate review structured data
  const reviewJsonLd = generateReviewJsonLd([
    {
      author: "Youssef El Mansouri",
      rating: 5,
      reviewBody: "Cette formation a transformé ma carrière. Je suis passé de débutant à la mise en œuvre de systèmes AI complexes en 6 mois.",
      datePublished: "2024-10-15"
    },
    {
      author: "Khadija Benali", 
      rating: 5,
      reviewBody: "Le cursus m'a apporté théorie et compétences pratiques. Les formateurs sont de vrais experts.",
      datePublished: "2024-11-02"
    },
    {
      author: "Omar Lamrini",
      rating: 4,
      reviewBody: "Pour intégrer l'AI à ma startup, ce programme était idéal. La partie déploiement AI était précieuse.",
      datePublished: "2024-09-20"
    }
  ]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" }
  ]);

  // Organization structured data
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <div className="min-h-[100dvh] bg-white">
      <SEOHead 
        title="Formation IA, Programmation & Cybersécurité | AVS INSTITUTE Maroc"
        description="🎯 Formation IA, Programmation & Cybersécurité au Maroc. Certifications Harvard, MIT, Stanford, Google, Microsoft. 95% réussite, 85% insertion. Inscriptions ouvertes !"
        keywords="formation IA Maroc, programmation Casablanca, cybersécurité Rabat, data science Morocco, certification Google, Harvard MIT Stanford, emploi tech Maroc"
        canonicalUrl="https://avs.ma/"
        jsonLd={[faqJsonLd, reviewJsonLd, breadcrumbJsonLd, organizationJsonLd]}
        ogImage="https://avs.ma/images/avs-social-share.jpg"
      />
      
      {/* Optimized homepage content */}
      <OptimizedHomepage />
    </div>
  );
};

export default Index;
