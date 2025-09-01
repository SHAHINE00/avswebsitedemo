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
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  Target,
  CheckCircle,
  Clock,
  MapPin,
  Award,
  Briefcase,
  Laptop,
  Zap
} from 'lucide-react';
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/utils/seoData';

const BlogDevenirDeveloppeur = () => {
  // TL;DR points
  const tldrPoints = [
    {
      icon: <Code2 className="w-4 h-4" />,
      text: "Développeurs très demandés au Maroc : +120% d'offres en 2024"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      text: "Salaires dev : 12-35k MAD/mois selon l'expérience"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Formation complète en 24 semaines chez AVS INSTITUTE"
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "5 langages essentiels : JavaScript, Python, Java, C#, PHP"
    },
    {
      icon: <Briefcase className="w-4 h-4" />,
      text: "500+ entreprises recrutent des devs au Maroc"
    }
  ];

  // Technology stack comparison
  const stackComparison = {
    title: "Technologies Développement : Popularité & Salaires au Maroc",
    subtitle: "Données basées sur les offres d'emploi 2024",
    columns: ["Demande", "Salaire Débutant", "Salaire Expérimenté", "Perspective"],
    rows: [
      {
        feature: "JavaScript (React/Node)",
        values: ["Très haute", "12-18k MAD", "25-35k MAD", "Excellente"]
      },
      {
        feature: "Python (Django/Flask)",
        values: ["Haute", "13-19k MAD", "24-32k MAD", "Excellente"]
      },
      {
        feature: "Java (Spring)",
        values: ["Haute", "14-20k MAD", "26-38k MAD", "Très bonne"]
      },
      {
        feature: "C# (.NET)",
        values: ["Moyenne", "13-18k MAD", "23-30k MAD", "Bonne"]
      },
      {
        feature: "PHP (Laravel)",
        values: ["Moyenne", "10-15k MAD", "20-28k MAD", "Stable"]
      },
      {
        feature: "Mobile (React Native/Flutter)",
        values: ["Très haute", "15-22k MAD", "28-40k MAD", "Excellente"]
      }
    ]
  };

  // Career paths comparison
  const careerPaths = {
    title: "Parcours Développeur : Spécialisations & Évolutions",
    subtitle: "Opportunités de carrière selon la spécialisation",
    columns: ["Durée formation", "Premier emploi", "Après 3 ans", "Après 5+ ans"],
    rows: [
      {
        feature: "Frontend Developer",
        values: ["4-6 mois", "12-16k MAD", "20-28k MAD", "30-45k MAD"]
      },
      {
        feature: "Backend Developer",
        values: ["6-8 mois", "14-18k MAD", "22-30k MAD", "32-50k MAD"]
      },
      {
        feature: "Full Stack Developer",
        values: ["8-12 mois", "15-20k MAD", "25-35k MAD", "35-55k MAD"]
      },
      {
        feature: "Mobile Developer",
        values: ["6-10 mois", "16-22k MAD", "28-38k MAD", "40-60k MAD"]
      },
      {
        feature: "DevOps Engineer",
        values: ["10-15 mois", "18-25k MAD", "30-42k MAD", "45-70k MAD"]
      }
    ]
  };

  // FAQ data
  const faqData = [
    {
      question: "Combien de temps faut-il pour devenir développeur au Maroc ?",
      answer: "Avec une formation intensive, 6-12 mois suffisent pour décrocher votre premier emploi. Les bootcamps comme celui d'AVS INSTITUTE (24 semaines) vous préparent efficacement au marché du travail avec projets pratiques et accompagnement emploi."
    },
    {
      question: "Peut-on devenir développeur sans diplôme d'informatique ?",
      answer: "Absolument ! Les entreprises marocaines privilégient les compétences pratiques. De nombreux développeurs autodidactes ou issus de reconversion réussissent. L'important est de maîtriser les technologies demandées et avoir un portfolio solide."
    },
    {
      question: "Quels sont les langages de programmation les plus demandés au Maroc ?",
      answer: "JavaScript (React, Angular, Node.js) domine le marché, suivi de Python, Java, et PHP. Les technologies mobile (React Native, Flutter) sont très recherchées. AVS INSTITUTE forme sur les stacks les plus demandées par les entreprises."
    },
    {
      question: "Quel salaire espérer comme développeur débutant au Maroc ?",
      answer: "Un développeur junior gagne 12-18k MAD/mois selon la technologie. Avec 2-3 ans d'expérience : 20-30k MAD. Les seniors (5+ ans) peuvent atteindre 35-50k MAD, voire plus en tant que freelance ou dans des multinationales."
    },
    {
      question: "Comment trouver son premier emploi de développeur au Maroc ?",
      answer: "Portfolio GitHub solide, profil LinkedIn optimisé, candidatures ciblées, networking dans les événements tech. AVS INSTITUTE offre un accompagnement emploi avec simulation d'entretiens et mise en relation avec 200+ entreprises partenaires."
    },
    {
      question: "Vaut-il mieux être freelance ou salarié comme développeur au Maroc ?",
      answer: "Les deux ont des avantages. Salarié : stabilité, équipe, avantages sociaux (12-50k MAD/mois). Freelance : liberté, projets variés, revenus potentiellement plus élevés (500-2000 MAD/jour). Beaucoup commencent salariés puis deviennent freelances."
    }
  ];

  const faqJsonLd = generateFAQJsonLd(faqData);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: "Devenir Développeur Maroc", url: "/blog/devenir-developpeur-maroc" }
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead 
        title="Devenir Développeur au Maroc 2024 : Guide Complet | AVS INSTITUTE"
        description="🖥️ Guide complet pour devenir développeur au Maroc : roadmap, technologies, salaires (12-50k MAD), formation 24 semaines, offres d'emploi. Début immédiat !"
        keywords="devenir développeur Maroc, formation programmation Casablanca, salaire développeur Morocco, JavaScript Python Java, bootcamp dev Rabat"
        canonicalUrl="https://avs.ma/blog/devenir-developpeur-maroc"
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Devenir Développeur au Maroc en 2024
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Le guide complet pour lancer votre carrière en développement : technologies, 
              formations, salaires, et opportunités au Maroc
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Lecture : 15 min
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Maroc Focus
              </span>
              <span className="flex items-center gap-1">
                <Code2 className="w-4 h-4" />
                Guide Pratique
              </span>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-academy-blue">+120%</div>
                <div className="text-xs text-gray-600">Offres dev 2024</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-academy-blue">500+</div>
                <div className="text-xs text-gray-600">Entreprises recrutent</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-academy-blue">24</div>
                <div className="text-xs text-gray-600">Semaines formation</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-academy-blue">35k</div>
                <div className="text-xs text-gray-600">Salaire max (MAD)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* TL;DR Section */}
            <TLDRSection 
              title="🎯 Développeur au Maroc en Bref"
              points={tldrPoints}
              className="mb-12"
            />

            {/* Market Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                🚀 Le Marché du Développement au Maroc
              </h2>
              
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Le Maroc connaît un <strong>boom technologique sans précédent</strong>. La transformation 
                  digitale des entreprises, l'essor des fintech, et le développement de l'e-commerce 
                  créent une demande explosive pour les développeurs qualifiés.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Selon l'<em>Association Marocaine des Technologies de l'Information</em>, 
                  plus de <strong>500 entreprises</strong> recherchent activement des développeurs 
                  en 2024, offrant des perspectives d'emploi excellentes pour les nouveaux diplômés.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                        <span>+120% d'offres dev en 2024</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>500+ entreprises recrutent</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Pénurie de talents qualifiés</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Types d'Entreprises
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Startups tech (150+)</li>
                      <li>• ESN/SSII (80+)</li>
                      <li>• Banques & Assurances (20+)</li>
                      <li>• E-commerce (100+)</li>
                      <li>• Multinationales (50+)</li>
                      <li>• Agences digitales (200+)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <MapPin className="w-5 h-5 mr-2" />
                      Hubs Tech Maroc
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Casablanca</strong> : 60% des offres</li>
                      <li>• <strong>Rabat</strong> : 25% des offres</li>
                      <li>• <strong>Marrakech</strong> : 10% des offres</li>
                      <li>• <strong>Tétouan</strong> : 3% des offres</li>
                      <li>• <strong>Remote</strong> : 2% des offres</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Technologies Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                💻 Technologies et Langages Demandés
              </h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">🏆 Top 5 des Technologies au Maroc</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    { 
                      name: "JavaScript", 
                      badge: "Most Popular",
                      color: "bg-yellow-500",
                      frameworks: ["React", "Vue.js", "Angular", "Node.js"],
                      demand: "Très haute",
                      salary: "12-35k MAD"
                    },
                    { 
                      name: "Python", 
                      badge: "Versatile",
                      color: "bg-blue-500",
                      frameworks: ["Django", "Flask", "FastAPI"],
                      demand: "Haute",
                      salary: "13-32k MAD"
                    },
                    { 
                      name: "Java", 
                      badge: "Enterprise",
                      color: "bg-red-500",
                      frameworks: ["Spring", "Spring Boot"],
                      demand: "Haute",
                      salary: "14-38k MAD"
                    },
                    { 
                      name: "PHP", 
                      badge: "Web Classic",
                      color: "bg-purple-500",
                      frameworks: ["Laravel", "Symfony"],
                      demand: "Moyenne",
                      salary: "10-28k MAD"
                    },
                    { 
                      name: "C#", 
                      badge: "Microsoft",
                      color: "bg-green-500",
                      frameworks: [".NET", "ASP.NET"],
                      demand: "Moyenne",
                      salary: "13-30k MAD"
                    },
                    { 
                      name: "Mobile", 
                      badge: "Hot Trend",
                      color: "bg-pink-500",
                      frameworks: ["React Native", "Flutter"],
                      demand: "Très haute",
                      salary: "15-40k MAD"
                    }
                  ].map((tech, index) => (
                    <Card key={index} className="border-l-4 border-l-academy-blue">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tech.name}</CardTitle>
                          <Badge className={`${tech.color} text-white text-xs`}>
                            {tech.badge}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Frameworks</div>
                            <div className="flex flex-wrap gap-1">
                              {tech.frameworks.map((fw, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {fw}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Demande:</span>
                              <span className="font-medium">{tech.demand}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Salaire:</span>
                              <span className="font-medium">{tech.salary}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <ComparisonTable {...stackComparison} className="mb-8" />
            </section>

            {/* Learning Path */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                🎓 Roadmap pour Devenir Développeur
              </h2>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-700">
                      <Target className="w-5 h-5 mr-2" />
                      Étape 1 : Choisir sa Spécialisation (Semaine 1-2)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Frontend Development</h4>
                        <ul className="text-sm space-y-1">
                          <li>• HTML, CSS, JavaScript</li>
                          <li>• React ou Vue.js</li>
                          <li>• Responsive design</li>
                          <li>• User Experience (UX)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Backend Development</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Python/Django ou Node.js</li>
                          <li>• Bases de données (SQL/NoSQL)</li>
                          <li>• APIs REST</li>
                          <li>• Architecture serveur</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-700">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Étape 2 : Formation Intensive (Semaine 3-20)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Programme AVS INSTITUTE (24 semaines)</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Fondamentaux (4 semaines)</li>
                          <li>• Spécialisation (12 semaines)</li>
                          <li>• Projets pratiques (6 semaines)</li>
                          <li>• Stage entreprise (2 semaines)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Alternatives</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Autodidacte (6-12 mois)</li>
                          <li>• Université (2-3 ans)</li>
                          <li>• Cours en ligne (4-8 mois)</li>
                          <li>• Autres bootcamps (3-9 mois)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-700">
                      <Laptop className="w-5 h-5 mr-2" />
                      Étape 3 : Portfolio et Projets (Semaine 18-24)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Projets Essentiels</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Site vitrine responsif</li>
                          <li>• Application CRUD complète</li>
                          <li>• API REST fonctionnelle</li>
                          <li>• Projet collaboratif (GitHub)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Présence en Ligne</h4>
                        <ul className="text-sm space-y-1">
                          <li>• GitHub actif et organisé</li>
                          <li>• LinkedIn professionnel</li>
                          <li>• Portfolio personnel</li>
                          <li>• Participation communautés tech</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-700">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Étape 4 : Recherche d'Emploi (À partir semaine 20)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Préparation</h4>
                        <ul className="text-sm space-y-1">
                          <li>• CV technique optimisé</li>
                          <li>• Préparation entretiens</li>
                          <li>• Tests techniques</li>
                          <li>• Négociation salariale</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Canaux de Recherche</h4>
                        <ul className="text-sm space-y-1">
                          <li>• LinkedIn & réseaux pro</li>
                          <li>• Sites emploi spécialisés</li>
                          <li>• Événements tech & meetups</li>
                          <li>• Réseau AVS (200+ entreprises)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Career Evolution */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-academy-blue">
                📈 Évolution de Carrière et Salaires
              </h2>
              
              <ComparisonTable {...careerPaths} className="mb-8" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Progression Salariale Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Junior (0-2 ans)</span>
                        <span className="text-academy-blue font-bold">12-18k MAD</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Confirmé (2-5 ans)</span>
                        <span className="text-academy-blue font-bold">20-30k MAD</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Senior (5+ ans)</span>
                        <span className="text-academy-blue font-bold">30-50k MAD</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Lead/Architect</span>
                        <span className="text-academy-blue font-bold">40-70k MAD</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-academy-blue/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-academy-blue">
                      <Zap className="w-5 h-5 mr-2" />
                      Options Freelance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Débutant</span>
                        <span className="text-academy-blue font-bold">300-500 MAD/jour</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Intermédiaire</span>
                        <span className="text-academy-blue font-bold">600-1000 MAD/jour</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Expert</span>
                        <span className="text-academy-blue font-bold">1200-2000 MAD/jour</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Consultant Senior</span>
                        <span className="text-academy-blue font-bold">2000+ MAD/jour</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-academy-blue">
                ❓ Questions Fréquentes
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
                  🚀 Lancez Votre Carrière de Développeur
                </h3>
                <p className="text-xl mb-8 opacity-90">
                  Formation intensive 24 semaines • Portfolio professionnel • Accompagnement emploi
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm opacity-90">Semaines formation</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">90%</div>
                    <div className="text-sm opacity-90">Taux placement</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm opacity-90">Entreprises partenaires</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-white text-academy-blue hover:bg-gray-100"
                  >
                    <a href="/programming-course">Programme Développement</a>
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

export default BlogDevenirDeveloppeur;