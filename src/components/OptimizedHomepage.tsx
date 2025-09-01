import React from 'react';
import HeroSection from '@/components/HeroSection';
import TLDRSection from '@/components/TLDRSection';
import FeaturesSection from '@/components/FeaturesSection';
import ComparisonTable from '@/components/ComparisonTable';
import CurriculumSection from '@/components/CurriculumSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import InstructorsSection from '@/components/InstructorsSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import PartnersSection from '@/components/PartnersSection';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { 
  GraduationCap, 
  Clock, 
  Trophy, 
  Users, 
  Target, 
  Briefcase,
  CheckCircle,
  Star,
  Globe,
  Award
} from 'lucide-react';

const OptimizedHomepage: React.FC = () => {
  const { isSectionVisible } = useSectionVisibility();
  // TL;DR data for the homepage
  const tldrPoints = [
    {
      icon: <GraduationCap className="w-4 h-4" />,
      text: "3 piliers de formation : IA & Data Science, Programmation, Marketing Digital"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "Certifications Harvard, MIT, Stanford, Google, Microsoft, IBM"
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      text: "95% de réussite, 85% d'insertion professionnelle en 6 mois"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Formateurs experts, classes limitées à 15 étudiants maximum"
    },
    {
      icon: <Briefcase className="w-4 h-4" />,
      text: "Réseau de 200+ entreprises partenaires au Maroc et à l'international"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Formats flexibles : présentiel, hybride, e-learning 24/7"
    }
  ];

  // Comparison data
  const comparisonData = {
    title: "AVS INSTITUTE vs Formations Traditionnelles",
    subtitle: "Pourquoi choisir AVS pour votre formation tech ?",
    columns: ["AVS INSTITUTE", "Universités Publiques", "Formations Privées"],
    rows: [
      {
        feature: "Durée de formation",
        values: ["6-18 mois", "3-5 ans", "1-2 ans"]
      },
      {
        feature: "Certifications internationales",
        values: [true, false, false]
      },
      {
        feature: "Projets pratiques",
        values: [true, false, true]
      },
      {
        feature: "Accompagnement emploi",
        values: [true, false, false]
      },
      {
        feature: "Formateurs professionnels actifs",
        values: [true, false, true]
      },
      {
        feature: "Accès plateforme 24/7",
        values: [true, false, false]
      },
      {
        feature: "Tarif moyen",
        values: ["30-45k MAD", "Gratuit*", "50-80k MAD"]
      },
      {
        feature: "Taux d'insertion professionnelle",
        values: ["85%", "45%", "65%"]
      }
    ]
  };

  // Salary data for Morocco
  const salaryData = {
    title: "Salaires Moyens au Maroc après Formation AVS",
    subtitle: "Données basées sur nos diplômés des 3 dernières années",
    columns: ["Débutant", "2-3 ans d'exp.", "5+ ans d'exp."],
    rows: [
      {
        feature: "Data Scientist",
        values: ["15 000 MAD", "22 000 MAD", "35 000 MAD"]
      },
      {
        feature: "Développeur Full Stack",
        values: ["12 000 MAD", "18 000 MAD", "28 000 MAD"]
      },
      {
        feature: "Expert Cybersécurité",
        values: ["14 000 MAD", "25 000 MAD", "40 000 MAD"]
      },
      {
        feature: "DevOps Engineer",
        values: ["16 000 MAD", "24 000 MAD", "35 000 MAD"]
      },
      {
        feature: "Chef de Projet IA",
        values: ["18 000 MAD", "28 000 MAD", "45 000 MAD"]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {isSectionVisible('home_hero') && <HeroSection />}
      
      {/* TL;DR Section */}
      {isSectionVisible('home_tldr') && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <TLDRSection 
              title="🎯 AVS INSTITUTE en Bref"
              points={tldrPoints}
            />
          </div>
        </section>
      )}

      {/* Features Section */}
      {isSectionVisible('home_features') && <FeaturesSection />}

      {/* Comparison Tables */}
      {isSectionVisible('home_comparisons') && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
                Comparaisons et Données Clés
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Découvrez pourquoi AVS INSTITUTE est le meilleur choix pour votre formation tech au Maroc
              </p>
            </div>
            
            <div className="grid md:grid-cols-1 gap-8 mb-8">
              <ComparisonTable {...comparisonData} />
            </div>
            
            <div className="grid md:grid-cols-1 gap-8">
              <ComparisonTable {...salaryData} />
            </div>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {isSectionVisible('home_curriculum') && <CurriculumSection />}

      {/* Enhanced Testimonials with structured data */}
      {isSectionVisible('home_testimonials_enhanced') && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🌟 Témoignages de nos Alumni
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Plus de 3000 diplômés ont transformé leur carrière avec AVS INSTITUTE
              </p>
            </div>
            
            {/* Success Stats */}
            {isSectionVisible('home_success_stats') && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
                  <div className="text-3xl font-bold text-academy-blue">95%</div>
                  <div className="text-sm text-gray-600">Taux de réussite</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
                  <div className="text-3xl font-bold text-academy-blue">85%</div>
                  <div className="text-sm text-gray-600">Insertion en 6 mois</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
                  <div className="text-3xl font-bold text-academy-blue">+26</div>
                  <div className="text-sm text-gray-600">Spécialisations</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-academy-blue/10 to-academy-purple/10 rounded-lg">
                  <div className="text-3xl font-bold text-academy-blue">200+</div>
                  <div className="text-sm text-gray-600">Entreprises partenaires</div>
                </div>
              </div>
            )}
            
            {isSectionVisible('home_testimonials') && <TestimonialsSection />}
          </div>
        </section>
      )}

      {/* Instructors */}
      {isSectionVisible('home_instructors') && <InstructorsSection />}

      {/* Partners Section */}
      {isSectionVisible('home_partners') && <PartnersSection />}

      {/* FAQ Section */}
      {isSectionVisible('home_faq') && <FAQSection />}

      {/* CTA Section */}
      {isSectionVisible('home_cta') && <CTASection />}
    </div>
  );
};

export default OptimizedHomepage;