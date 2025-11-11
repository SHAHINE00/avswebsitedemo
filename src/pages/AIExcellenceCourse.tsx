import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Award, 
  Briefcase, 
  Rocket, 
  Shield, 
  Phone, 
  Mail, 
  ArrowRight,
  Star,
  Trophy,
  Lightbulb,
  TrendingUp,
  Network,
  MessageCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AIExcellenceCourse = () => {
  const modules = [
    {
      title: "Fondations de l'IA Générative",
      duration: "1 semaine",
      topics: [
        "Comprendre le potentiel réel de l'IA générative",
        "Maîtriser les bonnes pratiques de sécurité",
        "Identifier les cas d'usage adaptés à votre métier"
      ]
    },
    {
      title: "L'Art du Prompt Engineering",
      duration: "1 semaine",
      topics: [
        "Techniques avancées de formulation de prompts",
        "Méthodes pour des résultats parfaits à chaque fois",
        "Optimisation des conversations avec l'IA"
      ]
    },
    {
      title: "Résolution de Problèmes Complexes",
      duration: "1 semaine",
      topics: [
        "Décomposition méthodique des défis",
        "Création de solutions structurées",
        "Transformation des problèmes en opportunités"
      ]
    },
    {
      title: "Création de Personas et Outils Personnalisés",
      duration: "1 semaine",
      topics: [
        "Construction d'assistants IA sur mesure",
        "Création de personas experts pour chaque fonction",
        "Automatisation des analyses et conseils"
      ]
    },
    {
      title: "Automatisation et Gains de Productivité",
      duration: "1 semaine",
      topics: [
        "Automatisation des tâches répétitives",
        "Optimisation des rapports et e-mails",
        "Libération de temps pour la haute valeur ajoutée"
      ]
    },
    {
      title: "Projet Final et Certification",
      duration: "1 semaine",
      topics: [
        "Création de votre guide personnel de productivité",
        "Consolidation des compétences acquises",
        "Obtention de la certification reconnue"
      ]
    }
  ];

  const outcomes = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Dialogue Expert avec l'IA",
      description: "Obtenez des résultats de haute qualité en minutes avec des prompts précis et efficaces"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Résolution Structurée",
      description: "Transformez les défis complexes en plans d'action clairs et actionnables"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Assistants Personnalisés",
      description: "Créez vos propres outils IA pour des analyses de niveau consultant 24/7"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Productivité x3",
      description: "Libérez jusqu'à 5h par semaine pour les tâches à haute valeur ajoutée"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification Professionnelle",
      description: "Validez vos compétences avec une certification reconnue par les entreprises"
    }
  ];

  const stats = [
    { icon: <Clock className="w-8 h-8" />, value: "6 semaines", label: "Formation intensive" },
    { icon: <Users className="w-8 h-8" />, value: "6 modules", label: "Parcours complet" },
    { icon: <Target className="w-8 h-8" />, value: "1 projet", label: "Guide personnalisé" },
    { icon: <Award className="w-8 h-8" />, value: "Certification", label: "Reconnue industrie" }
  ];

  const problemPoints = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Temps Perdu sur des Tâches Répétitives",
      description: "Rapports, e-mails, synthèses... Des heures gaspillées chaque semaine sur du travail à faible valeur ajoutée"
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Créativité en Panne",
      description: "Les mêmes solutions qui reviennent. L'innovation ralentit. Vos équipes tournent en rond"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Retard Technologique Dangereux",
      description: "La peur ou méconnaissance de l'IA crée un désavantage compétitif face aux acteurs qui la maîtrisent"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Manque de Structure et de Rapidité",
      description: "Réunions interminables, projets qui s'enlisent. Sans méthodologie claire, l'efficacité collective en pâtit"
    }
  ];

  const benefits = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Dialoguer avec l'IA Comme des Experts",
      impact: "Obtenir des résultats de haute qualité en quelques minutes, pas en quelques heures. Fini les prompts approximatifs, place à la précision chirurgicale."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Gérer des Problèmes Complexes Étape par Étape",
      impact: "Transformer les défis en plans d'action structurés, plus rapidement. Plus de blocages, que des solutions claires et actionnables."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Créer Leurs Propres Outils sur Mesure",
      impact: "Obtenir des analyses et des conseils de niveau 'consultant' sur demande, 24/7. Chaque collaborateur a son assistant expert personnalisé."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Accélérer Radicalement la Rédaction",
      impact: "Libérer jusqu'à 5 heures par semaine par collaborateur, à réinvestir dans des tâches à haute valeur ajoutée."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Innover et Expérimenter Sans Limites",
      impact: "Générer des idées créatives, tester de nouveaux concepts, et prendre des décisions éclairées grâce à des analyses instantanées."
    }
  ];

  const differentiators = [
    {
      icon: <Award className="w-12 h-12" />,
      title: "Pédagogie Active 70% Pratique",
      description: "Pas de slides interminables. Chaque concept est immédiatement appliqué sur des cas réels tirés de votre secteur. Vos équipes apprennent en FAISANT."
    },
    {
      icon: <CheckCircle2 className="w-12 h-12" />,
      title: "Projet Final Concret et Personnalisé",
      description: "Chaque participant repart avec SON propre guide de productivité IA, adapté à SON poste. Un outil qu'il utilisera tous les jours."
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Adapté à VOTRE Contexte Professionnel",
      description: "Conçu pour les professionnels, par des professionnels. Nous adaptons les exemples et exercices à votre industrie et vos défis spécifiques."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-0 pb-0">
        {/* Hero Section - Enhanced */}
        <section className="relative py-4 md:py-8 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))] via-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))]">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          {/* Tech grid pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptLTQgMTJ2MmgtMnYtMmgyek0yOCAzMHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6bTAtNHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center text-white">
              {/* Urgency badge */}
              <div className="inline-flex items-center gap-2 mb-6 animate-fade-in">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 px-4 py-2 text-sm font-bold shadow-lg animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Formation Premium - Places Limitées
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="block bg-gradient-to-r from-yellow-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  L'Intelligence Artificielle
                </span>
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  pour l'Excellence au Travail
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-4 opacity-95 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Vos Équipes Perdent du Temps ? Transformez-les en Experts de la Productivité
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 text-base sm:text-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-300" />
                  <span>ROI visible en 2 semaines</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span>Certification reconnue</span>
                </div>
              </div>
              
              {/* Stats Grid - Enhanced */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {stats.map((stat, index) => (
                  <div key={index} className="group bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:border-white/40">
                    <div className="flex justify-center mb-2 text-yellow-300 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <div className="font-bold text-lg sm:text-2xl mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons - Stronger */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <a 
                  href="https://wa.me/212662632953?text=Bonjour,%20je%20souhaite%20plus%20d'informations%20sur%20la%20formation%20Intelligence%20Artificielle%20pour%20l'Excellence%20au%20Travail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                  <span className="relative z-10">Planifier une Démo Gratuite</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link 
                  to="/contact"
                  className="group border-2 border-white text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-[hsl(var(--academy-blue))] transition-all inline-flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:text-yellow-500 transition-colors" />
                  Demander une Consultation
                </Link>
              </div>
              
              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-90 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span>Rejoignez les entreprises qui ont fait le saut vers l'excellence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Pain Points */}
        <section className="py-12 bg-gradient-to-b from-white to-red-50 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-4 py-2 text-base">
                  Le Problème
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Votre Équipe Est-Elle Vraiment Prête pour Demain ?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Pendant que vos concurrents gagnent en vitesse, vos collaborateurs font face à ces défis :
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {problemPoints.map((point, index) => (
                  <Card key={index} className="group relative overflow-hidden border-2 border-red-200 bg-red-50/50 hover:border-red-400 transition-all transform hover:-translate-y-2">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          {point.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-3 text-gray-900">{point.title}</CardTitle>
                          <p className="text-gray-700 leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--academy-blue))] via-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))]"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0 px-4 py-2 text-base">
                La Solution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Une Formation qui Transforme, Pas qui Informe
              </h2>
              <div className="text-lg text-gray-700 space-y-6 text-left bg-white p-8 rounded-2xl border-2 shadow-xl">
                <p className="text-xl leading-relaxed">
                  <strong>Oubliez les cours théoriques.</strong> Cette formation est conçue pour les professionnels exigeants qui veulent des résultats mesurables, rapidement.
                </p>
                <p className="text-xl leading-relaxed">
                  Notre approche ? <strong className="text-[hsl(var(--academy-blue))]">100% pratique, 0% technique.</strong> Chaque participant construit son propre "système de productivité intelligent" qu'il utilisera dès le lendemain au bureau.
                </p>
                <p className="text-xl leading-relaxed">
                  En 6 semaines, vos collaborateurs passent de novices à experts en IA générative. Ils ne se contentent pas d'apprendre à "utiliser ChatGPT" — ils maîtrisent l'art de dialoguer avec l'intelligence artificielle.
                </p>
                <div className="bg-gradient-to-r from-[hsl(var(--academy-blue))]/10 to-[hsl(var(--academy-purple))]/10 p-6 rounded-xl border-l-4 border-[hsl(var(--academy-blue))]">
                  <p className="text-xl font-bold text-[hsl(var(--academy-blue))]">
                    Le résultat ? Des équipes autonomes, rapides, innovantes. Et un ROI visible dès la première semaine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - What They Will Achieve */}
        <section className="py-12 bg-gradient-to-br from-gray-900 via-[hsl(var(--academy-blue))]/90 to-[hsl(var(--academy-purple))]/90 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-yellow-400 text-black border-0 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2 inline" />
                La Transformation
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ce que Vos Équipes Sauront FAIRE (et DEVENIR)
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Des compétences concrètes qui transforment la performance de votre entreprise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-black flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                        {benefit.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-3 text-white">{benefit.title}</CardTitle>
                        <p className="text-white/90 leading-relaxed">
                          <strong className="text-yellow-300">→ Impact :</strong> {benefit.impact}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* ROI Highlight */}
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center text-black">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Résultat : Un Retour sur Investissement Mesurable
                  </h3>
                  <p className="text-xl opacity-90">
                    Productivité x2 à x3 sur les tâches courantes • Temps de formation récupéré en 2 semaines • Équipes motivées et autonomes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Modules Section - The Journey */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0">
                Le Parcours
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                De Novice à Expert en 6 Semaines
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Chaque module construit sur le précédent pour une progression logique et efficace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {modules.map((module, index) => (
                <Card key={index} className="group relative overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent hover:border-[hsl(var(--academy-blue))] transform hover:-translate-y-2">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))]/5 to-[hsl(var(--academy-purple))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Left colored bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))]"></div>
                  
                  <CardHeader className="relative pl-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0 text-base px-4 py-1">
                        Semaine {index + 1}
                      </Badge>
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 text-[hsl(var(--academy-blue))]" />
                        <span className="text-sm font-semibold text-gray-700">{module.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-4 group-hover:text-[hsl(var(--academy-blue))] transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative pl-6">
                    <ul className="space-y-4">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start group/item">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-green-500 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-green-600 group-hover/item:text-white transition-colors" />
                          </div>
                          <span className="text-gray-700 text-base leading-relaxed">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* CTA after modules */}
            <div className="text-center mt-12">
              <a 
                href="https://wa.me/212662632953?text=Bonjour,%20je%20souhaite%20plus%20d'informations%20sur%20la%20formation%20Intelligence%20Artificielle%20pour%20l'Excellence%20au%20Travail"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white px-12 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Je Veux Commencer Maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <p className="text-sm text-gray-500 mt-4">Formation sur mesure • Démarrage flexible</p>
            </div>
          </div>
        </section>

        {/* Differentiators Section - Why Us */}
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-6 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0 px-4 py-2 text-base">
                  Notre Différence
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Plus qu'un Cours, un Partenariat pour l'Excellence
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Ce qui nous rend différents et garantit vos résultats
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {differentiators.map((item, index) => (
                  <Card key={index} className="text-center border-2 hover:border-[hsl(var(--academy-blue))] transition-all transform hover:-translate-y-2 hover:shadow-xl">
                    <CardHeader>
                      <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-[hsl(var(--academy-blue))]/10 to-[hsl(var(--academy-purple))]/10 p-4 rounded-2xl">
                          <div className="text-[hsl(var(--academy-blue))]">
                            {item.icon}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-4">{item.title}</CardTitle>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Guarantee */}
              <div className="mt-12">
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">Garantie Résultats</h3>
                        <p className="text-gray-700 text-lg leading-relaxed">
                          Si vos équipes n'ont pas gagné au moins 3 heures par semaine après la formation, nous vous offrons une session de coaching individuel gratuite pour identifier et débloquer leurs gains de productivité.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Banner */}
        <section className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-green-700">95%</div>
                  <div className="text-sm text-gray-600">Taux de satisfaction</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-green-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-blue-700">x2-x3</div>
                  <div className="text-sm text-gray-600">Gain de productivité</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-green-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-purple-700">2 semaines</div>
                  <div className="text-sm text-gray-600">Pour rentabiliser</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--academy-blue))] rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--academy-purple))] rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Urgency banner */}
              <div className="inline-block mb-6 animate-pulse">
                <Badge className="bg-red-500 text-white border-0 px-6 py-3 text-base font-bold shadow-lg">
                  <Clock className="w-5 h-5 mr-2 inline animate-spin" style={{ animationDuration: '3s' }} />
                  PLACES LIMITÉES - FORMATION PREMIUM
                </Badge>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Prêt à Donner un Avantage Décisif
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  à Vos Équipes ?
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-6 opacity-90 leading-relaxed">
                Le monde professionnel évolue à vitesse grand V. Pendant que certaines entreprises forment leurs équipes et prennent de l'avance, d'autres accumulent du retard. <span className="font-bold text-yellow-300">Dans quel camp voulez-vous être dans 6 mois ?</span>
              </p>
              
              {/* Value stack */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 border border-white/20">
                <p className="text-xl font-semibold mb-6">
                  Ne laissez pas passer cette opportunité. Les places sont limitées pour garantir un accompagnement de qualité.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Formation Intensive 6 Semaines</div>
                      <div className="text-white/70">Programme complet + pratique</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Certification Reconnue</div>
                      <div className="text-white/70">Validée par l'industrie</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Guide Personnalisé</div>
                      <div className="text-white/70">Outil concret et actionnable</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Support Continu</div>
                      <div className="text-white/70">Accompagnement personnalisé</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main CTA */}
              <div className="space-y-6">
                <a 
                  href="https://wa.me/212662632953?text=Bonjour,%20je%20souhaite%20planifier%20un%20appel%20stratégique%20pour%20la%20formation%20Intelligence%20Artificielle%20pour%20l'Excellence%20au%20Travail"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-8 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl md:text-2xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Phone className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 relative z-10" />
                  <span className="relative z-10">Planifier un Appel Stratégique</span>
                  <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 ml-2 sm:ml-3 relative z-10 group-hover:translate-x-2 transition-transform" />
                </a>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Sans engagement • Réponse sous 24h • Consultation personnalisée offerte</span>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="mt-12 pt-12 border-t border-white/20">
                <h3 className="text-2xl font-bold mb-8">Contactez-Nous Dès Maintenant</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <a 
                    href="tel:+212524311982"
                    className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Téléphone</p>
                      <p className="text-sm text-white/80">+212 5 24 31 19 82</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/212662632953"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">WhatsApp</p>
                      <p className="text-sm text-white/80">+212 6 62 63 29 53</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:info@avs.ma"
                    className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <p className="text-sm text-white/80">info@avs.ma</p>
                    </div>
                  </a>
                </div>

                <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm text-white/70 italic">
                    "Investir dans la formation de vos équipes, c'est investir dans l'avenir de votre entreprise. Faites-le maintenant, avant que vos concurrents ne prennent trop d'avance."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIExcellenceCourse;
