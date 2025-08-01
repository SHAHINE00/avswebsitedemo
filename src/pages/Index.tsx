
import React from 'react';
import SEOHead from '@/components/SEOHead';
import DynamicPageRenderer from '@/components/ui/DynamicPageRenderer';
import { pageSEO, generateFAQJsonLd, generateReviewJsonLd, generateBreadcrumbJsonLd } from '@/utils/seoData';

const Index = () => {
  // Generate FAQ structured data
  const faqJsonLd = generateFAQJsonLd([
    {
      question: "Quelles formations proposez-vous à AVS INSTITUTE ?",
      answer: "Nous proposons trois piliers de spécialisation : IA & Data Science, Programmation & Infrastructure, et Marketing Digital & Créatif avec des certifications reconnues."
    },
    {
      question: "Les formations sont-elles reconnues et certifiantes ?",
      answer: "Oui, toutes nos formations sont reconnues par l'État et délivrent des certifications internationales en partenariat avec Harvard, MIT, Stanford, Google, Microsoft et IBM."
    },
    {
      question: "Quelle est la durée des formations ?",
      answer: "Les durées varient : IA & Data Science (18 mois), Programmation (24 semaines), Marketing Digital (12 mois) avec format hybride disponible."
    },
    {
      question: "Ai-je besoin d'expérience préalable ?",
      answer: "Non, nos formations sont conçues pour tous les niveaux avec des modules de mise à niveau inclus."
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHead 
        {...pageSEO.home} 
        canonicalUrl="https://avs.ma/"
        jsonLd={[faqJsonLd, reviewJsonLd, breadcrumbJsonLd]}
      />
      
      {/* Add proper top padding to account for fixed navbar on mobile */}
      <div className="pt-16 sm:pt-18">
        <DynamicPageRenderer pageName="home" />
      </div>
    </div>
  );
};

export default Index;
