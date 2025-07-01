import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, BookOpen, Target, Users, Award, Sparkles, Brain, Code, Database, Cloud, Shield, Zap, GraduationCap, Clock, Calendar, Star, TrendingUp, Users2, Briefcase, Building2, ChevronRight, Lightbulb, BookMarked, PresentationChart, TestTube, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const tableOfContents = [
    { section: "I", title: "Présentation du Programme de Formation", anchor: "presentation", icon: BookOpen },
    { section: "II", title: "Synthèse du Programme de Formation", anchor: "synthese", icon: Target },
    { section: "III", title: "Buts du Programme de Formation", anchor: "buts", icon: Award },
    { section: "IV", title: "Objectifs Généraux", anchor: "objectifs", icon: Brain },
    { section: "V", title: "Curriculum 1ère Année", anchor: "curriculum", icon: Code },
    { section: "VI", title: "Curriculum 2ème Année", anchor: "curriculum2", icon: Database },
    { section: "IX", title: "Stratégies Pédagogiques et Système d'Évaluation", anchor: "strategies", icon: GraduationCap }
  ];

  const keyAreas = [
    { title: "Connaissances IA", description: "Carrières, formations, éthique et gouvernance", icon: Brain, color: "from-blue-500 to-purple-600" },
    { title: "Math & Statistiques", description: "Algèbre linéaire, calcul et probabilités", icon: Target, color: "from-purple-500 to-pink-600" },
    { title: "Programmation", description: "Python, algorithmes et ML basics", icon: Code, color: "from-green-500 to-blue-600" },
    { title: "Gestion de Données", description: "SQL, preprocessing et visualisation", icon: Database, color: "from-orange-500 to-red-600" },
    { title: "IA Avancée", description: "Deep learning, NLP et computer vision", icon: Zap, color: "from-teal-500 to-cyan-600" },
    { title: "Cloud & Déploiement", description: "AWS, GCP, Azure et modèles IA", icon: Cloud, color: "from-indigo-500 to-purple-600" }
  ];

  const programGoals = [
    {
      id: "III.1",
      title: "Efficacité Professionnelle",
      description: "Rendre la personne efficace dans l'exercice d'une profession.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      details: "Développer les compétences techniques et pratiques nécessaires pour exceller dans le domaine de l'IA"
    },
    {
      id: "III.2", 
      title: "Intégration Professionnelle",
      description: "Assurer l'intégration de la personne à la vie professionnelle.",
      icon: Users2,
      color: "from-purple-500 to-pink-500",
      details: "Faciliter l'insertion dans les équipes et environnements de travail spécialisés en IA"
    },
    {
      id: "III.3",
      title: "Évolution des Savoirs",
      description: "Favoriser l'évolution et l'approfondissement des savoirs professionnels.",
      icon: Lightbulb,
      color: "from-emerald-500 to-teal-500",
      details: "Encourager l'apprentissage continu et l'adaptation aux nouvelles technologies"
    },
    {
      id: "III.4",
      title: "Mobilité Professionnelle",
      description: "Assurer la mobilité professionnelle.",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
      details: "Permettre l'adaptation à différents secteurs et rôles dans l'écosystème IA"
    }
  ];

  const teachingStrategies = [
    {
      title: "Approches Pédagogiques",
      icon: BookMarked,
      color: "from-blue-500 to-indigo-600",
      content: "Notre approche combine cours magistraux, travaux pratiques, projets en équipe et stages en entreprise. L'accent est mis sur l'apprentissage par la pratique avec des projets concrets utilisant des données réelles.",
      features: ["Cours magistraux interactifs", "Travaux pratiques intensifs", "Projets collaboratifs", "Stages en entreprise"]
    },
    {
      title: "Système d'Évaluation",
      icon: TestTube,
      color: "from-purple-500 to-pink-600",
      content: "L'évaluation se base sur un contrôle continu incluant des examens théoriques, des projets pratiques, des présentations orales et un projet de fin d'études. Chaque module est évalué selon des critères spécifiques adaptés à ses objectifs pédagogiques.",
      features: ["Contrôle continu", "Examens théoriques", "Projets pratiques", "Évaluations orales"]
    },
    {
      title: "Outils & Technologies",
      icon: PresentationChart,
      color: "from-emerald-500 to-cyan-600",
      content: "Utilisation d'environnements de développement modernes, plateformes cloud, et outils collaboratifs pour simuler les conditions réelles de travail en entreprise.",
      features: ["Environnements cloud", "Outils collaboratifs", "Plateformes modernes", "Simulation entreprise"]
    },
    {
      title: "Suivi Personnalisé",
      icon: UserCheck,
      color: "from-orange-500 to-red-600",
      content: "Accompagnement individualisé avec mentoring, suivi de progression, et support adapté aux besoins spécifiques de chaque apprenant.",
      features: ["Mentoring individuel", "Suivi personnalisé", "Support adaptatif", "Coaching carrière"]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="pt-24 pb-20 bg-gradient-to-br from-academy-blue via-academy-purple to-academy-lightblue text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Programme d'Excellence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Formation Complète en
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Intelligence Artificielle
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transformez votre carrière avec notre programme innovant conçu pour former les experts IA de demain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-academy-blue hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl">
                <Link to="/register">
                  Commencer maintenant <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow">
        {/* Key Areas Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Domaines Clés</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Maîtrisez les compétences essentielles pour exceller dans l'intelligence artificielle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {keyAreas.map((area, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <area.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-academy-blue transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {area.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Table of Contents */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Sommaire du Programme</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explorez chaque section de notre programme complet
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tableOfContents.map((item, index) => (
                  <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5 group-hover:from-academy-blue/10 group-hover:to-academy-purple/10 transition-all duration-300"></div>
                    <CardContent className="p-0 relative z-10">
                      <a 
                        href={`#${item.anchor}`} 
                        className="block p-8 h-full"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-academy-blue to-academy-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <item.icon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center mb-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-academy-blue to-academy-purple text-white font-bold text-sm mr-3">
                                {item.section}
                              </span>
                              <span className="text-sm text-gray-500 font-medium">SECTION</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-academy-blue transition-colors duration-300 leading-tight">
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0">
                            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-academy-blue transition-all duration-300 transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Program Presentation */}
        <section id="presentation" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">I. Présentation du Programme</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    Programme Professionnel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Formation complète en Intelligence Artificielle conçue pour développer une expertise technique 
                    et pratique dans les technologies IA les plus avancées du marché.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    Objectifs de Formation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Former des spécialistes capables de concevoir, développer et déployer des solutions IA 
                    innovantes répondant aux défis technologiques actuels et futurs.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    Compétences Acquises
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Maîtrise complète des outils et techniques : Python, ML/DL, traitement de données, 
                    déploiement cloud et gestion de projets IA.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Public Cible
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Professionnels en reconversion, ingénieurs, étudiants diplômés et passionnés de technologie 
                    souhaitant se spécialiser en IA.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Program Synthesis */}
        <section id="synthese" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">II. Synthèse du Programme de Formation</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un programme structuré sur 2 années pour une expertise complète en Intelligence Artificielle
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              {/* Program Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">1ère Année</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Modules</span>
                        <span className="font-bold text-academy-blue">14</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Durée</span>
                        <span className="font-bold text-academy-blue">10 mois</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Focus</span>
                        <span className="font-bold text-academy-blue">Fondamentaux</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Bases techniques, mathématiques, programmation Python et introduction au ML
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 group-hover:from-purple-500/20 group-hover:to-pink-600/20 transition-all duration-300"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">2ème Année</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Modules</span>
                        <span className="font-bold text-academy-purple">13</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Durée</span>
                        <span className="font-bold text-academy-purple">10 mois</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Focus</span>
                        <span className="font-bold text-academy-purple">Spécialisation</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Deep Learning, NLP, Computer Vision, déploiement et projets avancés
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 group-hover:from-emerald-500/20 group-hover:to-teal-600/20 transition-all duration-300"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Programme Total</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Modules</span>
                        <span className="font-bold text-emerald-600">27</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Durée</span>
                        <span className="font-bold text-emerald-600">20 mois</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Niveau</span>
                        <span className="font-bold text-emerald-600">Expert</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Formation complète du débutant à l'expert en Intelligence Artificielle
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Program Timeline */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Progression Pédagogique</h3>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-academy-blue via-academy-purple to-academy-lightblue rounded-full"></div>
                  
                  <div className="space-y-16">
                    {/* Year 1 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 pr-8 text-right">
                        <Card className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
                          <CardContent className="p-6">
                            <h4 className="text-xl font-bold text-academy-blue mb-2">Première Année</h4>
                            <p className="text-gray-700 mb-3">Fondamentaux et bases techniques</p>
                            <div className="flex items-center justify-end space-x-4 text-sm">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-academy-blue" />
                                <span>10 mois</span>
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1 text-academy-blue" />
                                <span>14 modules</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-academy-blue rounded-full border-4 border-white shadow-lg z-10"></div>
                      
                      <div className="flex-1 pl-8">
                        <div className="text-gray-600">
                          <p className="text-sm leading-relaxed">
                            • Mathématiques pour l'IA<br/>
                            • Programmation Python avancée<br/>
                            • Introduction au Machine Learning<br/>
                            • Gestion et visualisation de données
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Year 2 */}
                    <div className="relative flex items-center">
                      <div className="flex-1 pr-8">
                        <div className="text-gray-600 text-right">
                          <p className="text-sm leading-relaxed">
                            • Deep Learning et réseaux de neurones<br/>
                            • NLP et Computer Vision<br/>
                            • Déploiement cloud et production<br/>
                            • Projet de fin d'études
                          </p>
                        </div>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-academy-purple rounded-full border-4 border-white shadow-lg z-10"></div>
                      
                      <div className="flex-1 pl-8">
                        <Card className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
                          <CardContent className="p-6">
                            <h4 className="text-xl font-bold text-academy-purple mb-2">Deuxième Année</h4>
                            <p className="text-gray-700 mb-3">Spécialisation et expertise avancée</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-academy-purple" />
                                <span>10 mois</span>
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1 text-academy-purple" />
                                <span>13 modules</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Goals */}
        <section id="buts" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">III. Buts du Programme de Formation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-academy-blue mb-2">III.1</h3>
                  <p>Rendre la personne efficace dans l'exercice d'une profession.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-academy-blue mb-2">III.2</h3>
                  <p>Assurer l'intégration de la personne à la vie professionnelle.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-academy-blue mb-2">III.3</h3>
                  <p>Favoriser l'évolution et l'approfondissement des savoirs professionnels.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-academy-blue mb-2">III.4</h3>
                  <p>Assurer la mobilité professionnelle.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced General Objectives */}
        <section id="objectifs" className="py-20 bg-academy-gray">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">IV. Objectifs Généraux</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Le programme vise à développer chez les apprenants une expertise complète en intelligence artificielle, 
                  combinant les aspects théoriques fondamentaux et les applications pratiques. Les objectifs incluent 
                  la maîtrise des algorithmes d'apprentissage automatique, la capacité à traiter et analyser des données complexes, 
                  la compréhension des enjeux éthiques et légaux de l'IA, ainsi que le développement de compétences en 
                  déploiement et maintenance de systèmes d'IA en production.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced First Year Curriculum */}
        <section id="curriculum" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">V. Curriculum 1ère Année</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">Fondamentaux et bases techniques - 10 mois intensifs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {firstYearModules.map((module, index) => (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-academy-blue to-academy-purple text-white px-3 py-1 rounded-lg text-sm font-bold mr-3">
                        {module.code}
                      </span>
                      <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                        {module.duration}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-academy-blue transition-colors duration-300">
                      {module.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Second Year Curriculum */}
        <section id="curriculum2" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">VI. Curriculum 2ème Année</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-purple to-academy-lightblue mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600">Spécialisation avancée et projets professionnels - 10 mois</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {secondYearModules.map((module, index) => (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-gradient-to-r from-academy-purple to-academy-lightblue text-white px-3 py-1 rounded-lg text-sm font-bold mr-3">
                        {module.code}
                      </span>
                      <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                        {module.duration}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-academy-purple transition-colors duration-300">
                      {module.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Teaching Strategies */}
        <section id="strategies" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">IX. Stratégies Pédagogiques et Système d'Évaluation</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-academy-blue to-academy-purple mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Méthodes innovantes et évaluation adaptée pour une formation d'excellence
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {teachingStrategies.map((strategy, index) => (
                  <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${strategy.color} flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                          <strategy.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-academy-blue transition-colors duration-300">
                          {strategy.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {strategy.content}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-academy-blue mr-2" />
                          Caractéristiques
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {strategy.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                              <ChevronRight className="w-4 h-4 text-academy-blue mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Additional Info Section */}
              <div className="mt-12">
                <Card className="border-0 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-8 text-white">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-6">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold">Excellence Pédagogique</h3>
                    </div>
                    <p className="text-xl text-center opacity-90 max-w-4xl mx-auto leading-relaxed">
                      Notre approche pédagogique unique combine innovation technologique et accompagnement personnalisé 
                      pour garantir le succès de chaque apprenant dans son parcours vers l'expertise en IA.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Call to Action */}
        <section className="py-20 bg-gradient-to-br from-academy-blue via-academy-purple to-academy-lightblue text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-float"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Rejoignez l'Excellence</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-bold mb-6">
                Prêt à Transformer
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Votre Carrière ?
                </span>
              </h3>
              <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Rejoignez notre programme d'excellence et devenez un expert recherché en Intelligence Artificielle
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-academy-blue hover:bg-gray-100 font-bold px-10 py-6 text-lg rounded-xl shadow-2xl">
                  <Link to="/register">
                    S'inscrire maintenant <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-academy-blue font-bold px-10 py-6 text-lg rounded-xl">
                  <Link to="/contact">
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourse;
