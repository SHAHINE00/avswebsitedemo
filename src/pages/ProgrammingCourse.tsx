
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/programming-course/HeroSection';
import KeyAreasSection from '@/components/programming-course/KeyAreasSection';
import TableOfContentsSection from '@/components/programming-course/TableOfContentsSection';
import PresentationSection from '@/components/programming-course/PresentationSection';
import SynthesisSection from '@/components/programming-course/SynthesisSection';
import ProgramGoalsSection from '@/components/programming-course/ProgramGoalsSection';
import ObjectivesSection from '@/components/programming-course/ObjectivesSection';
import CurriculumSection from '@/components/programming-course/CurriculumSection';
import TeachingStrategiesSection from '@/components/programming-course/TeachingStrategiesSection';
import CTASection from '@/components/programming-course/CTASection';
import SEOHead from '@/components/SEOHead';
import { courseSEO, generateCourseJsonLd, generateBreadcrumbJsonLd } from '@/utils/seoData';

const ProgrammingCourse = () => {
  const firstYearModules = [
    { code: "M01", title: "INTRODUCTION À LA PROGRAMMATION", duration: "2 semaines" },
    { code: "M02", title: "ALGORITHMES ET STRUCTURES DE DONNÉES", duration: "3 semaines" },
    { code: "M03", title: "PROGRAMMATION ORIENTÉE OBJET", duration: "3 semaines" },
    { code: "M04", title: "INTRODUCTION AUX BASES DE DONNÉES", duration: "2 semaines" },
    { code: "M05", title: "DÉVELOPPEMENT WEB FRONT-END (HTML, CSS, JAVASCRIPT)", duration: "4 semaines" },
    { code: "M06", title: "DÉVELOPPEMENT WEB BACK-END (NODE.JS, PHP, MYSQL)", duration: "4 semaines" },
    { code: "M07", title: "DÉVELOPPEMENT MOBILE (ANDROID, SWIFT)", duration: "3 semaines" },
    { code: "M08", title: "MÉTHODOLOGIES DE DÉVELOPPEMENT AGILE", duration: "2 semaines" },
    { code: "M09", title: "PROJET PRATIQUE DE PROGRAMMATION", duration: "4 semaines" }
  ];

  const secondYearModules = [
    { code: "M10", title: "FRAMEWORKS ET BIBLIOTHÈQUES DE DÉVELOPPEMENT (REACT, ANGULAR)", duration: "4 semaines" },
    { code: "M11", title: "DÉVELOPPEMENT DE JEUX VIDÉO AVEC UNITY", duration: "3 semaines" },
    { code: "M12", title: "ARCHITECTURE DES APPLICATIONS WEB", duration: "3 semaines" },
    { code: "M13", title: "CYBERSÉCURITÉ ET SÉCURISATION DES APPLICATIONS", duration: "3 semaines" },
    { code: "M14", title: "INTRODUCTION À L'INTELLIGENCE ARTIFICIELLE EN PROGRAMMATION", duration: "3 semaines" },
    { code: "M15", title: "DEVOPS ET INTÉGRATION CONTINUE", duration: "3 semaines" },
    { code: "M16", title: "DÉPLOIEMENT ET HÉBERGEMENT DES APPLICATIONS", duration: "2 semaines" },
    { code: "M17", title: "ANALYSE DES PERFORMANCES ET OPTIMISATION DES APPLICATIONS", duration: "2 semaines" },
    { code: "M18", title: "PROJET FINAL DE DÉVELOPPEMENT D'APPLICATION", duration: "6 semaines" }
  ];

  const courseJsonLd = generateCourseJsonLd({
    name: "Technicien Spécialisé Programmation & Développement",
    description: "Formation complète en programmation : développement web, mobile, frameworks modernes, DevOps et architecture. 24 semaines de formation pratique.",
    duration: "24 semaines",
    level: "Débutant à Avancé",
    instructor: "Développeurs experts certifiés"
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Formations", url: "/curriculum" },
    { name: "Technicien Spécialisé Programmation", url: "/programming-course" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        {...courseSEO["formation-programmation"]} 
        canonicalUrl="https://avs.ma/programming-course"
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

export default ProgrammingCourse;
