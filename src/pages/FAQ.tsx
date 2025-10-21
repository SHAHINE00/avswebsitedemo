import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import TLDRSection from '@/components/TLDRSection';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle, BookOpen, Users, CreditCard, Clock, Target } from 'lucide-react';
import { generateFAQJsonLd, generateBreadcrumbJsonLd } from '@/utils/seoData';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // TL;DR points for FAQ page
  const tldrPoints = [
    {
      icon: <HelpCircle className="w-4 h-4" />,
      text: "50+ questions/réponses sur nos formations IA, Programmation, Cybersécurité"
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: "Informations complètes : admissions, tarifs, débouchés, modalités"
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: "Support étudiant disponible 7j/7 via chat, email, téléphone"
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "Recherche intégrée pour trouver rapidement vos réponses"
    }
  ];

  // Categorized FAQ data
  const faqCategories = [
    {
      category: "Formations et Programmes",
      icon: <BookOpen className="w-5 h-5" />,
      questions: [
        {
          question: "Quelles formations proposez-vous à AVS INSTITUTE ?",
          answer: "Nous proposons trois piliers de spécialisation : IA & Data Science (18 mois), Programmation & Infrastructure (24 semaines), et Marketing Digital & Créatif (12 mois) avec des certifications internationales Harvard, MIT, Stanford, Google, Microsoft et IBM."
        },
        {
          question: "Quelle est la différence entre vos formations IA et Data Science ?",
          answer: "La formation IA se concentre sur le machine learning, deep learning et l'automatisation. Data Science couvre l'analyse de données, la visualisation, et les statistiques. Les deux sont complémentaires et souvent combinées dans notre cursus intégré."
        },
        {
          question: "Proposez-vous des formations courtes ou des bootcamps ?",
          answer: "Oui, nous proposons des bootcamps intensifs de 12 semaines en programmation, des formations courtes en cybersécurité (8 semaines), et des workshops weekends pour se former rapidement aux nouvelles technologies."
        },
        {
          question: "Les formations sont-elles disponibles en ligne ?",
          answer: "Oui, toutes nos formations sont disponibles en format hybride : présentiel + en ligne. Plateforme e-learning 24/7, classes virtuelles interactives, projets collaboratifs en ligne, et support technique permanent."
        },
        {
          question: "Quels logiciels et outils utilise-t-on dans les formations ?",
          answer: "IA : Python, TensorFlow, PyTorch, Jupyter, AWS ML, Google Cloud AI. Programmation : JavaScript, React, Node.js, Docker, Kubernetes. Cybersécurité : Kali Linux, Wireshark, Metasploit, SIEM. Accès gratuit à tous les outils pro."
        }
      ]
    },
    {
      category: "Admissions et Prérequis",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: "Quelles sont les conditions d'admission à AVS INSTITUTE ?",
          answer: "Baccalauréat ou équivalent, motivation pour les technologies, test de logique et entretien de motivation. Aucun prérequis technique spécifique. Nous évaluons surtout la motivation et les capacités d'apprentissage."
        },
        {
          question: "Ai-je besoin d'expérience en programmation pour commencer ?",
          answer: "Non, nos formations accueillent tous les niveaux. Modules de mise à niveau inclus, accompagnement personnalisé, et mentorat individuel pour garantir votre réussite, même sans expérience technique préalable."
        },
        {
          question: "Comment se déroule le processus d'inscription ?",
          answer: "1) Inscription en ligne sur avs.ma 2) Test de positionnement gratuit (30 min) 3) Entretien de motivation (45 min) 4) Confirmation et inscription définitive. Processus en 48h maximum."
        },
        {
          question: "Y a-t-il un âge limite pour s'inscrire ?",
          answer: "Aucune limite d'âge. Nos étudiants ont entre 18 et 55 ans. Programmes adaptés aux reconversions professionnelles, évolutions de carrière, ou premières formations post-bac."
        },
        {
          question: "Proposez-vous des tests de niveau avant l'inscription ?",
          answer: "Oui, test de positionnement gratuit pour évaluer votre niveau et personnaliser votre parcours. Comprend : logique, mathématiques de base, culture technologique, et évaluation de motivation."
        }
      ]
    },
    {
      category: "Tarifs et Financement",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          question: "Combien coûtent les formations à AVS INSTITUTE ?",
          answer: "Nos tarifs : IA & Data Science (45 000 MAD), Programmation (35 000 MAD), Marketing Digital (30 000 MAD). Tout inclus : cours, projets, plateforme, certification, accompagnement emploi."
        },
        {
          question: "Proposez-vous des facilités de paiement ?",
          answer: "Oui, plusieurs options : paiement en 3, 6, ou 12 fois sans frais, bourses d'études (jusqu'à 30% de réduction), paiement par l'employeur, financement ANAPEC pour demandeurs d'emploi."
        },
        {
          question: "Y a-t-il des bourses d'études disponibles ?",
          answer: "Oui, bourses au mérite (30% de réduction), bourses sociales (20% de réduction), bourses femmes en tech (25% de réduction). Plus de 100 bourses attribuées chaque année selon critères sociaux et académiques."
        },
        {
          question: "Les entreprises peuvent-elles financer la formation de leurs employés ?",
          answer: "Oui, formations entreprise avec facturation directe, programmes sur-mesure, formation continue prise en charge. Partenariats avec 50+ entreprises pour la formation de leurs équipes."
        },
        {
          question: "Que comprend le prix de la formation ?",
          answer: "Tout inclus : cours théoriques et pratiques, projets encadrés, plateforme e-learning 24/7, certification internationale, accompagnement emploi, support technique, accès alumni à vie."
        }
      ]
    },
    {
      category: "Carrières et Débouchés",
      icon: <Target className="w-5 h-5" />,
      questions: [
        {
          question: "Quels sont les débouchés après une formation en IA ?",
          answer: "Data Scientist (15-25k MAD/mois), Ingénieur IA (18-30k MAD), Consultant IA (20-35k MAD), Chef de projet IA (25-40k MAD). Secteurs : banques, télécoms, e-commerce, industrie, santé."
        },
        {
          question: "Quel salaire espérer après une formation programmation ?",
          answer: "Développeur Full Stack (12-20k MAD), DevOps Engineer (15-25k MAD), Architecte Logiciel (20-35k MAD), Lead Developer (25-40k MAD). Évolution rapide avec l'expérience et la spécialisation."
        },
        {
          question: "AVS INSTITUTE aide-t-il à trouver un emploi ?",
          answer: "Oui, service placement inclus : préparation CV tech, simulations d'entretiens, ateliers LinkedIn, mise en relation avec 200+ entreprises partenaires, suivi post-formation pendant 12 mois."
        },
        {
          question: "Quel est votre taux de placement ?",
          answer: "85% de nos diplômés trouvent un emploi dans les 6 mois. 95% dans l'année. Suivi personnalisé, réseau d'entreprises partenaires actif, et accompagnement carrière à vie."
        },
        {
          question: "Peut-on créer sa startup après la formation ?",
          answer: "Absolument ! 15% de nos diplômés créent leur startup. Accompagnement entrepreneurial : business plan, pitch, recherche financement, incubation, réseau d'investisseurs partenaires."
        }
      ]
    },
    {
      category: "Organisation et Modalités",
      icon: <Clock className="w-5 h-5" />,
      questions: [
        {
          question: "Où se déroulent les cours ?",
          answer: "Campus principal à Casablanca (Maarif), centre à Rabat (Agdal). Formations aussi en ligne avec classes virtuelles interactives, projets collaboratifs, et accès 24/7 à la plateforme."
        },
        {
          question: "Quels sont les horaires de cours ?",
          answer: "Formats flexibles : journée (9h-17h), soirée (18h-21h), weekends (9h-18h), e-learning asynchrone. 70% de nos étudiants sont en activité professionnelle."
        },
        {
          question: "Combien d'étudiants par classe ?",
          answer: "Maximum 15 étudiants par classe pour garantir un suivi personnalisé, des échanges de qualité, et une attention individualisée de nos formateurs experts."
        },
        {
          question: "Y a-t-il des projets pratiques ?",
          answer: "Oui, 60% du temps consacré aux projets pratiques : création d'applications, analyses de données réelles, projets clients, hackathons, portfolio professionnel, stage en entreprise."
        },
        {
          question: "Comment se déroulent les évaluations ?",
          answer: "Évaluation continue : projets (60%), examens théoriques (20%), présentation finale (20%). Pas de partiels stressants, focus sur la pratique et les compétences professionnelles."
        }
      ]
    }
  ];

  // Flatten all questions for search
  const allQuestions = faqCategories.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.category }))
  );

  // Filter questions based on search term
  const filteredCategories = searchTerm 
    ? [{
        category: "Résultats de recherche",
        icon: <Search className="w-5 h-5" />,
        questions: allQuestions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }]
    : faqCategories;

  // Generate JSON-LD for all FAQ questions
  const allFAQs = faqCategories.flatMap(category => category.questions);
  const faqJsonLd = generateFAQJsonLd(allFAQs);
  
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "FAQ", url: "/faq" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        title="FAQ - Questions Fréquentes | AVS INSTITUTE Maroc"
        description="🔍 Toutes les réponses à vos questions sur les formations AVS : IA, Programmation, Cybersécurité. Admissions, tarifs, débouchés, modalités. Support 7j/7."
        keywords="FAQ AVS Institute, questions formations IA Maroc, admission programmation, tarifs cybersécurité, débouchés tech Morocco"
        canonicalUrl="https://avs.ma/faq"
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center mb-8">
            Toutes les réponses à vos questions sur nos formations IA, Programmation et Cybersécurité. 
            Support disponible 7j/7 pour vous accompagner.
          </p>
          
          {/* TL;DR Section */}
          <div className="max-w-4xl mx-auto">
            <TLDRSection 
              title="🎯 FAQ en Bref"
              points={tldrPoints}
            />
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher dans la FAQ (ex: tarifs, IA, admission...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-academy-blue/20 focus:border-academy-blue rounded-xl"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="text-academy-blue border-academy-blue hover:bg-academy-blue hover:text-white"
                >
                  Effacer la recherche
                </Button>
              </div>
            )}
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-academy-blue/10 to-academy-purple/10 rounded-lg">
                  <span className="text-academy-blue mr-3">
                    {category.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-academy-blue">
                    {category.category}
                  </h2>
                  <span className="ml-auto bg-academy-blue text-white px-3 py-1 rounded-full text-sm">
                    {category.questions.length} questions
                  </span>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 [&[data-state=open]]:bg-academy-blue/5">
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
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-academy-blue to-academy-purple rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Notre équipe support est disponible 7j/7 pour répondre à toutes vos questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                variant="secondary" 
                className="bg-white text-academy-blue hover:bg-gray-100"
              >
                <Link to="/contact">Nous Contacter</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-academy-blue"
              >
                <a href="tel:+212522000000">Appeler : 0522 00 00 00</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;