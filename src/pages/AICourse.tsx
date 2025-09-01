import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/ai-course/HeroSection';
import KeyAreasSection from '@/components/ai-course/KeyAreasSection';
import TableOfContentsSection from '@/components/ai-course/TableOfContentsSection';
import PresentationSection from '@/components/ai-course/PresentationSection';
import SynthesisSection from '@/components/ai-course/SynthesisSection';
import ProgramGoalsSection from '@/components/ai-course/ProgramGoalsSection';
import ObjectivesSection from '@/components/ai-course/ObjectivesSection';
import CurriculumSection from '@/components/ai-course/CurriculumSection';
import TeachingStrategiesSection from '@/components/ai-course/TeachingStrategiesSection';
import CTASection from '@/components/ai-course/CTASection';
import SEOHead from '@/components/SEOHead';
import { courseSEO, generateCourseJsonLd, generateBreadcrumbJsonLd } from '@/utils/seoData';

const AICourse = () => {
  const firstYearModules = [
    { code: "M01", title: "MÉTIERS ET FORMATION EN INTELLIGENCE ARTIFICIELLE", duration: "2 semaines" },
    { code: "M02", title: "L'ENTREPRISE, ÉTHIQUE ET GOUVERNANCE EN IA", duration: "2 semaines" },
    { code: "M03", title: "MATHÉMATIQUES FONDAMENTALES POUR L'IA", duration: "4 semaines" },
    { code: "M04", title: "ALGORITHMIQUE ET PROGRAMMATION PYTHON POUR L'IA", duration: "4 semaines" },
    { code: "M05", title: "INTRODUCTION AUX BASES DE DONNÉES ET SQL", duration: "3 semaines" },
    { code: "M06", title: "STATISTIQUE DESCRIPTIVE ET INFÉRENTIELLE POUR L'IA", duration: "3 semaines" },
    { code: "M07", title: "PRÉTRAITEMENT ET VISUALISATION DE DONNÉES", duration: "3 semaines" },
    { code: "M08", title: "INTRODUCTION AU MACHINE LEARNING", duration: "4 semaines" },
    { code: "M09", title: "OUTILS ET ENVIRONNEMENTS DE DÉVELOPPEMENT POUR L'IA", duration: "2 semaines" },
    { code: "M10", title: "COMMUNICATION PROFESSIONNELLE ET TECHNIQUE", duration: "2 semaines" },
    { code: "M11", title: "ANGLAIS TECHNIQUE POUR L'IA", duration: "2 semaines" },
    { code: "M12", title: "VEILLE TECHNOLOGIQUE ET SCIENTIFIQUE EN IA", duration: "2 semaines" },
    { code: "M13", title: "GESTION DE PROJET AGILE APPLIQUÉE À L'IA", duration: "3 semaines" },
    { code: "M14", title: "STAGE D'IMMERSION EN ENTREPRISE (STAGE I)", duration: "4 semaines" }
  ];

  const secondYearModules = [
    { code: "M15", title: "TECHNIQUES AVANCÉES DE MACHINE LEARNING", duration: "4 semaines" },
    { code: "M16", title: "INTRODUCTION AU DEEP LEARNING ET RÉSEAUX DE NEURONES", duration: "4 semaines" },
    { code: "M17", title: "TRAITEMENT AUTOMATIQUE DU LANGAGE NATUREL (NLP)", duration: "4 semaines" },
    { code: "M18", title: "VISION PAR ORDINATEUR (COMPUTER VISION)", duration: "4 semaines" },
    { code: "M19", title: "MANIPULATION DE DONNÉES AVANCÉE AVEC PANDAS ET NUMPY", duration: "3 semaines" },
    { code: "M20", title: "FRAMEWORKS DE MACHINE LEARNING", duration: "4 semaines" },
    { code: "M21", title: "INTRODUCTION AUX PLATEFORMES CLOUD POUR L'IA", duration: "3 semaines" },
    { code: "M22", title: "PRINCIPES DE DÉPLOIEMENT DE MODÈLES IA", duration: "4 semaines" },
    { code: "M23", title: "QUALITÉ, TEST ET VALIDATION DES MODÈLES D'IA", duration: "3 semaines" },
    { code: "M24", title: "ÉTUDES DE CAS ET PROJETS PRATIQUES INTÉGRÉS EN IA", duration: "4 semaines" },
    { code: "M25", title: "DROIT, ÉTHIQUE, BIAIS ET RESPONSABILITÉ EN IA", duration: "3 semaines" },
    { code: "M26", title: "PRÉPARATION À L'INSERTION PROFESSIONNELLE", duration: "3 semaines" },
    { code: "M27", title: "PROJET DE FIN D'ÉTUDES EN INTELLIGENCE ARTIFICIELLE", duration: "6 semaines" }
  ];

  const courseJsonLd = generateCourseJsonLd({
    name: "Formation Intelligence Artificielle & Machine Learning",
    description: "Formation complète en Intelligence Artificielle : Machine Learning, Deep Learning, Big Data, NLP et Computer Vision. 18 mois de formation pratique avec projets concrets.",
    duration: "18 mois",
    level: "Débutant à Expert",
    instructor: "Experts IA certifiés"
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Formations", url: "/curriculum" },
    { name: "Technicien Spécialisé IA", url: "/ai-course" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        {...courseSEO["formation-ia"]} 
        canonicalUrl="https://avs.ma/ai-course"
        jsonLd={[courseJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      <HeroSection />
      
      <main className="flex-grow">
        <KeyAreasSection />
        <TableOfContentsSection />
        <PresentationSection />
        <SynthesisSection />
        <ProgramGoalsSection />
        <ObjectivesSection />
        <CurriculumSection year={1} modules={firstYearModules} />
        <CurriculumSection year={2} modules={secondYearModules} />
        <TeachingStrategiesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourse;
