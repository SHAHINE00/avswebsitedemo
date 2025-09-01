import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import TLDRSection from '@/components/TLDRSection';
import ComparisonTable from '@/components/ComparisonTable';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  Target,
  CheckCircle,
  Clock,
  MapPin,
  Award
} from 'lucide-react';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/utils/seoData';

const BlogGuideIA2024 = () => {
  // TL;DR points
  const tldrPoints = [
    {
      icon: <Brain className="w-4 h-4" />,
      text: "L'IA génère 50 milliards $ au Maroc d'ici 2030 selon McKinsey"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Croissance de 150% des offres d'emploi IA au Maroc en 2024"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "Salaires IA : 15-35k MAD/mois, évolution rapide"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Formation AVS : 95% réussite, 85% placement en 6 mois"
    },
    {
      icon: <Award className="w-4 h-4" />,
      text: "Certifications Harvard, MIT, Google, Microsoft incluses"
    }
  ];

  // Market data for Morocco
  const marketData = {
    title: "Marché de l'IA au Maroc : Opportunités 2024-2025",
    subtitle: "Secteurs, investissements et croissance prévue",
    columns: ["Secteur", "Investissement (M MAD)", "Emplois créés", "Croissance"],
    rows: [
      {
        feature: "Banques & Finance",
        values: ["2 500", "1 200", "+180%"]
      },
      {
        feature: "Télécommunications",
        values: ["1 800", "900", "+150%"]
      },
      {
        feature: "E-commerce",
        values: ["1 200", "600", "+200%"]
      },
      {
        feature: "Industrie 4.0",
        values: ["3 000", "1 500", "+160%"]
      },
      {
        feature: "Santé digitale",
        values: ["800", "400", "+140%"]
      },
      {
        feature: "Agriculture Tech",
        values: ["600", "300", "+120%"]
      }
    ]
  };

  // Training comparison
  const trainingComparison = {
    title: "Formations IA au Maroc : Comparatif 2024",
    subtitle: "AVS INSTITUTE vs autres options de formation",
    columns: ["AVS INSTITUTE", "Universités Publiques", "Autres Privés", "Auto-formation"],
    rows: [
      {
        feature: "Durée",
        values: ["18 mois", "3-5 ans", "2-3 ans", "Variable"]
      },
      {
        feature: "Certification internationale",
        values: [true, false, false, false]
      },
      {
        feature: "Projets réels",
        values: [true, false, true, false]
      },
      {
        feature: "Accompagnement emploi",
        values: [true, false, false, false]
      },
      {
        feature: "Taux placement",
        values: ["85%", "45%", "65%", "25%"]
      },
      {
        feature: "Salaire moyen après",
        values: ["22k MAD", "15k MAD", "18k MAD", "12k MAD"]
      }
    ]
  };

  // FAQ data for this article
  const faqData = [
    {
      question: "Pourquoi l'IA est-elle stratégique pour le Maroc ?",
      answer: "Le Maroc investit massivement dans la transformation digitale. L'IA permet d'optimiser l'agriculture, moderniser les services publics, développer les fintech, et positionner le royaume comme hub tech africain. Plan National IA 2030 : 50 milliards MAD d'investissement."
    },
    {
      question: "Quels sont les métiers IA les plus recherchés au Maroc ?",
      answer: "Data Scientist (15-25k MAD), Ingénieur Machine Learning (18-30k MAD), Consultant IA (20-35k MAD), Architecte IA (25-40k MAD), Product Manager IA (22-38k MAD). Forte demande dans banques, télécoms, e-commerce."
    },
    {
      question: "Comment se former à l'IA au Maroc sans expérience technique ?",
      answer: "Formations accessibles : bootcamps intensifs, cours en ligne, formations courtes. AVS INSTITUTE propose un parcours complet de 18 mois avec mise à niveau incluse, projets pratiques, et accompagnement emploi. Aucun prérequis technique."
    },
    {
      question: "Quel est l'investissement pour une formation IA de qualité ?",
      answer: "Formation IA complète : 30-50k MAD. AVS INSTITUTE : 45k MAD tout inclus (cours, projets, certification Harvard/MIT, placement). ROI rapide : salaires 15-35k MAD/mois dès la sortie. Facilités de paiement disponibles."
    },
    {
      question: "L'IA va-t-elle remplacer les emplois au Maroc ?",
      answer: "L'IA transforme plutôt qu'elle ne remplace. Selon le McKinsey Global Institute, l'IA créera plus d'emplois qu'elle n'en supprimera au Maroc. Importance de se former pour accompagner cette transformation et saisir les opportunités."
    }
  ];

  const faqJsonLd = generateFAQJsonLd(faqData);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: "Guide IA Maroc 2024", url: "/blog/guide-ia-maroc-2024" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        title="Guide IA au Maroc 2024 : Formation, Emploi, Salaires | AVS INSTITUTE"
        description="🚀 Guide complet IA au Maroc 2024 : opportunités emploi, salaires (15-35k MAD), formations certifiantes, secteurs porteurs. Plan carrière IA détaillé."
        keywords="IA Maroc 2024, intelligence artificielle Morocco, formation IA Casablanca, emploi IA Rabat, salaire data scientist Maroc, machine learning formation"
        canonicalUrl="https://avs.ma/blog/guide-ia-maroc-2024"
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Guide Complet IA au Maroc 2024
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Formation, emploi, salaires, opportunités : tout ce qu'il faut savoir pour réussir 
              sa carrière en Intelligence Artificielle au Maroc
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-8">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Lecture : 12 min
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Maroc Focus
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Guide 2024
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* TL;DR Section */}
            <TLDRSection 
              title="🎯 L'IA au Maroc en Bref"
              points={tldrPoints}
              className="mb-12"
            />

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                🚀 L'Intelligence Artificielle au Maroc : Une Révolution en Cours
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Le Maroc connaît une véritable <strong>révolution technologique</strong> avec l'essor de l'Intelligence Artificielle. 
                  Selon le <em>McKinsey Global Institute</em>, l'IA pourrait générer jusqu'à <strong>50 milliards de dirhams</strong> 
                  de valeur ajoutée pour l'économie marocaine d'ici 2030.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Cette transformation crée des opportunités inédites pour les professionnels marocains. 
                  Les secteurs de la banque, des télécommunications, de l'e-commerce et de l'industrie 
                  recherchent activement des talents en IA, offrant des salaires attractifs et des 
                  perspectives d'évolution exceptionnelles.
                </p>
              </div>
            </section>

            {/* Market Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                📊 État du Marché IA au Maroc
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Croissance du Secteur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>+150% d'offres d'emploi IA en 2024</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Plan National IA 2030 : 50 Md MAD</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Hub IA Africain en développement</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Rémunérations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Data Scientist</span>
                        <strong>15-25k MAD</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Ingénieur IA</span>
                        <strong>18-30k MAD</strong>
                      </li>
                      <li className="flex justify-between">
                        <span>Consultant IA</span>
                        <strong>20-35k MAD</strong>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <ComparisonTable {...marketData} className="mb-8" />
            </section>

            {/* Training Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                🎓 Se Former à l'IA au Maroc : Options et Stratégies
              </h2>
              
              <div className="prose prose-lg max-w-none mb-8">
                <h3 className="text-2xl font-semibold mb-4">Les Différentes Voies de Formation</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Le paysage de la formation IA au Maroc s'est considérablement enrichi. 
                  Plusieurs options s'offrent aux candidats, chacune avec ses avantages :
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-l-4 border-l-academy-blue">
                  <CardHeader>
                    <CardTitle className="text-lg">Formations Spécialisées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Bootcamps intensifs (3-6 mois)</li>
                      <li>• Programmes complets (12-18 mois)</li>
                      <li>• Certifications internationales</li>
                      <li>• Projets pratiques</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-academy-purple">
                  <CardHeader>
                    <CardTitle className="text-lg">Universités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Masters spécialisés</li>
                      <li>• Formation théorique solide</li>
                      <li>• Durée longue (2-3 ans)</li>
                      <li>• Moins d'aspects pratiques</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Auto-formation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>• Cours en ligne (Coursera, edX)</li>
                      <li>• Flexibilité totale</li>
                      <li>• Moins d'encadrement</li>
                      <li>• Pas de certification reconnue</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <ComparisonTable {...trainingComparison} className="mb-8" />

              <div className="bg-gradient-to-r from-academy-blue/10 to-academy-purple/10 p-6 rounded-lg">
                <h4 className="text-xl font-bold text-academy-blue mb-4">
                  🏆 Pourquoi Choisir AVS INSTITUTE ?
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Certifications Harvard, MIT, Stanford</span>
                    </li>
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Classes limitées à 15 étudiants</span>
                    </li>
                    <li className="flex items-start">
                      <Target className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>85% de placement en 6 mois</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BookOpen className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>60% de projets pratiques</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Formats flexibles (soir, weekend)</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <span>Facilités de paiement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Career Roadmap */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                🛣️ Roadmap Carrière IA au Maroc
              </h2>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-700">
                      Étape 1 : Formation (6-18 mois)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Acquérir les compétences fondamentales en IA, machine learning, et data science.
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm">
                      <li>• Python, R, SQL</li>
                      <li>• TensorFlow, PyTorch</li>
                      <li>• Statistiques et mathématiques</li>
                      <li>• Projets portfolio</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-700">
                      Étape 2 : Premier Emploi (0-2 ans)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Postes junior dans des entreprises marocaines ou multinationales.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Postes typiques :</strong>
                        <ul className="text-sm mt-2">
                          <li>• Junior Data Scientist</li>
                          <li>• Analyste BI</li>
                          <li>• Assistant ML Engineer</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Salaires :</strong>
                        <ul className="text-sm mt-2">
                          <li>• 12-18k MAD/mois</li>
                          <li>• Avantages sociaux</li>
                          <li>• Formation continue</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-700">
                      Étape 3 : Spécialisation (2-5 ans)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Développement d'expertise dans un domaine spécifique de l'IA.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Spécialisations :</strong>
                        <ul className="text-sm mt-2">
                          <li>• Computer Vision</li>
                          <li>• NLP</li>
                          <li>• Deep Learning</li>
                          <li>• MLOps</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Évolution salaire :</strong>
                        <ul className="text-sm mt-2">
                          <li>• 18-28k MAD/mois</li>
                          <li>• Responsabilités accrues</li>
                          <li>• Projets stratégiques</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gold-500 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-yellow-700">
                      Étape 4 : Leadership (5+ ans)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Postes de direction, conseil stratégique, ou entrepreneuriat.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Postes seniors :</strong>
                        <ul className="text-sm mt-2">
                          <li>• Chief Data Officer</li>
                          <li>• Consultant Senior IA</li>
                          <li>• Entrepreneur Tech</li>
                          <li>• Formateur Expert</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Rémunérations :</strong>
                        <ul className="text-sm mt-2">
                          <li>• 30-50k+ MAD/mois</li>
                          <li>• Stock options</li>
                          <li>• Consulting (500-1500 MAD/jour)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-academy-blue">
                ❓ Questions Fréquentes sur l'IA au Maroc
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                      <span className="font-semibold text-gray-800 pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-white border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Call to Action */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-academy-blue to-academy-purple rounded-2xl p-8 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">
                  🚀 Lancez Votre Carrière IA Maintenant
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Rejoignez les 3000+ diplômés AVS INSTITUTE qui transforment l'économie marocaine
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm opacity-90">Taux de réussite</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm opacity-90">Placement en 6 mois</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">22k</div>
                    <div className="text-sm opacity-90">Salaire moyen (MAD)</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-white text-academy-blue hover:bg-gray-100"
                  >
                    <a href="/ai-course">Découvrir la Formation IA</a>
                  </Button>
                  <Button 
                    asChild 
                    size="lg"
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-academy-blue"
                  >
                    <a href="/contact">Conseil Gratuit</a>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogGuideIA2024;