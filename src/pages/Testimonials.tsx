
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import SEOHead from '@/components/SEOHead';
import { pageSEO, generateReviewJsonLd, generateBreadcrumbJsonLd } from '@/utils/seoData';

const Testimonials = () => {
  const reviewJsonLd = generateReviewJsonLd([
    {
      author: "Youssef El Mansouri",
      rating: 5,
      reviewBody: "Cette formation a transformé ma carrière. Je suis passé de débutant à la mise en œuvre de systèmes AI complexes en 6 mois. Les projets pratiques ont vraiment consolidé mes acquis !",
      datePublished: "2024-10-15"
    },
    {
      author: "Khadija Benali",
      rating: 5,
      reviewBody: "Le cursus m'a apporté théorie et compétences pratiques pour mon travail. Les formateurs sont de vrais experts et le contenu est constamment à jour.",
      datePublished: "2024-11-02"
    },
    {
      author: "Omar Lamrini",
      rating: 4,
      reviewBody: "Pour intégrer l'AI à ma startup, ce programme était idéal. La partie sur le déploiement AI a été particulièrement précieuse.",
      datePublished: "2024-09-20"
    },
    {
      author: "Fatima Zahra Kadiri",
      rating: 5,
      reviewBody: "Excellente formation avec un suivi personnalisé. J'ai trouvé un emploi de Data Scientist 2 mois après l'obtention de mon diplôme.",
      datePublished: "2024-08-30"
    },
    {
      author: "Ahmed Ben Salah",
      rating: 5,
      reviewBody: "Formation très complète qui m'a permis de créer ma propre entreprise de développement web. Recommandé !",
      datePublished: "2024-09-10"
    }
  ]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Témoignages", url: "/testimonials" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        {...pageSEO.testimonials} 
        canonicalUrl="https://avs.ma/testimonials"
        jsonLd={[reviewJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Témoignages</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez ce que disent nos diplômés sur leur expérience avec notre programme.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Testimonials;
