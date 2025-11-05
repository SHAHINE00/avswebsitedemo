import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Bot, Rocket, CheckCircle2, Clock, Award, Users, Target, Sparkles, TrendingUp, Cpu, Network, ArrowRight, Star, Shield, Trophy, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AIAutomationCourse = () => {
  const modules = [
    {
      title: "Introduction à l'IA et ingénierie des prompts",
      duration: "2 semaines",
      topics: [
        "Principes fondamentaux de l'intelligence artificielle",
        "Formulation avancée des prompts",
        "Applications pratiques de l'IA"
      ]
    },
    {
      title: "Outils d'automatisation et leurs applications",
      duration: "3 semaines",
      topics: [
        "Découverte de Zapier, n8n et Make",
        "Création de workflows automatisés",
        "Intégration multi-plateformes"
      ]
    },
    {
      title: "Construction d'agents intelligents",
      duration: "2 semaines",
      topics: [
        "Architecture des agents d'IA",
        "Intégration via API",
        "Création de chatbots et assistants intelligents"
      ]
    },
    {
      title: "Projet pratique intégré",
      duration: "3 semaines",
      topics: [
        "Application des compétences acquises",
        "Conception de solution complète",
        "Déploiement et présentation"
      ]
    }
  ];

  const outcomes = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Maîtrise des prompts avancés",
      description: "Créez des prompts efficaces pour maximiser les performances de l'IA"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Expert en automatisation",
      description: "Automatisez les processus répétitifs et gagnez en productivité"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Développement d'agents IA",
      description: "Construisez des agents intelligents performants et adaptatifs"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Portfolio professionnel",
      description: "Présentez votre projet final comme preuve de vos compétences"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification reconnue",
      description: "Obtenez une certification valorisant vos nouvelles compétences"
    }
  ];

  const stats = [
    { icon: <Clock className="w-8 h-8" />, value: "10 semaines", label: "Durée totale" },
    { icon: <Users className="w-8 h-8" />, value: "4 modules", label: "Formation complète" },
    { icon: <Target className="w-8 h-8" />, value: "1 projet", label: "Projet intégré" },
    { icon: <Award className="w-8 h-8" />, value: "Certification", label: "Diplôme officiel" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-20 pb-12">
        {/* Hero Section - Enhanced */}
        <section className="relative py-12 md:py-20 overflow-hidden">
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
                  <Star className="w-4 h-4 mr-2" />
                  Places Limitées - Session Janvier 2026
                </Badge>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Formation CPAE
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  Certificat en Prompt Engineering et Automatisation
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-4 opacity-95 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Transformez votre carrière avec les compétences les plus recherchées du marché. Maîtrisez ChatGPT, créez des automatisations intelligentes et développez des agents IA.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 text-base sm:text-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-300" />
                  <span>+156% de demande</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <span>Certification officielle</span>
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
                <Link 
                  to="/contact"
                  className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Réserver Ma Place Maintenant</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/contact"
                  className="group border-2 border-white text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-[hsl(var(--academy-blue))] transition-all inline-flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:text-yellow-500 transition-colors" />
                  Télécharger le Programme
                </Link>
              </div>
              
              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-90 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-300" />
                  <span>Garantie satisfait ou remboursé</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>4.9/5 (142 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section - Enhanced */}
        <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--academy-blue))] via-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))]"></div>
          
          {/* Background decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--academy-blue))]/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-[hsl(var(--academy-purple))]/5 rounded-full filter blur-3xl"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-6 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0 px-4 py-2 text-base">
                  Pourquoi Maintenant ?
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  L'IA Révolutionne le Monde du Travail
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Ne restez pas à la traîne. Les professionnels qui maîtrisent l'IA gagnent en moyenne <span className="text-[hsl(var(--academy-blue))] font-bold">40% de plus</span> et sont <span className="text-[hsl(var(--academy-blue))] font-bold">3x plus recherchés</span> sur le marché.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 - Compétences Futures */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <Card className="relative bg-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 rounded-3xl overflow-hidden h-full">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))]"></div>
                    
                    <CardContent className="p-8 text-center">
                      {/* Icon with animated background */}
                      <div className="relative mb-6 inline-block">
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))]/20 to-[hsl(var(--academy-purple))]/20 rounded-3xl blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <Cpu className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">Compétences Futures</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        <span className="font-bold text-[hsl(var(--academy-blue))] text-xl">85%</span> des emplois de 2030 n'existent pas encore. Préparez-vous dès maintenant avec les compétences IA essentielles.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Card 2 - ROI Immédiat */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <Card className="relative bg-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 rounded-3xl overflow-hidden h-full">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-to-r from-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))]"></div>
                    
                    <CardContent className="p-8 text-center">
                      {/* Icon with animated background */}
                      <div className="relative mb-6 inline-block">
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-purple))]/20 to-[hsl(var(--academy-lightblue))]/20 rounded-3xl blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))] rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <TrendingUp className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">ROI Immédiat</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Automatisez jusqu'à <span className="font-bold text-[hsl(var(--academy-purple))] text-xl">15h</span> de travail par semaine dès la première semaine de formation. Rentabilisez votre investissement rapidement.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Card 3 - Avantage Compétitif */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-lightblue))] to-[hsl(var(--academy-blue))] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <Card className="relative bg-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-3 rounded-3xl overflow-hidden h-full">
                    {/* Gradient top bar */}
                    <div className="h-2 bg-gradient-to-r from-[hsl(var(--academy-lightblue))] to-[hsl(var(--academy-blue))]"></div>
                    
                    <CardContent className="p-8 text-center">
                      {/* Icon with animated background */}
                      <div className="relative mb-6 inline-block">
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-lightblue))]/20 to-[hsl(var(--academy-blue))]/20 rounded-3xl blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-[hsl(var(--academy-lightblue))] to-[hsl(var(--academy-blue))] rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <Network className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">Avantage Compétitif</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Démarquez-vous avec un portfolio de projets IA concrets. Impressionnez les recruteurs et clients.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Banner - NEW */}
        <section className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-y border-green-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-green-700">96%</div>
                  <div className="text-sm text-gray-600">Taux de satisfaction</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-green-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-blue-700">500+</div>
                  <div className="text-sm text-gray-600">Professionnels formés</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-green-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-2xl text-purple-700">100%</div>
                  <div className="text-sm text-gray-600">Certifiés</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section - Enhanced */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0">
                Programme Complet
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Votre Parcours vers l'Excellence
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Un programme intensif de 10 semaines conçu pour faire de vous un expert recherché en IA et automatisation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {modules.map((module, index) => (
                <Card key={index} className="group relative overflow-hidden hover:shadow-2xl transition-all border-2 border-transparent hover:border-[hsl(var(--academy-blue))] transform hover:-translate-y-2">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))]/5 to-[hsl(var(--academy-purple))]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white border-0 text-base px-4 py-1">
                        Semaine {index === 0 ? '1-2' : index === 1 ? '3-5' : index === 2 ? '6-7' : '8-10'}
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
                  <CardContent className="relative">
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
              <Link 
                to="/contact"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white px-12 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Je Veux Commencer Maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">Places limitées • Début: Janvier 2026</p>
            </div>
          </div>
        </section>

        {/* Outcomes Section - Enhanced */}
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
                Transformez Votre Carrière
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ce Que Vous Allez Accomplir
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                En 10 semaines, vous développerez un ensemble de compétences qui vous positionnera parmi les <span className="font-bold text-yellow-300">top 5%</span> des professionnels du digital
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {outcomes.map((outcome, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                    {outcome.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{outcome.title}</h3>
                  <p className="text-white/90 text-center text-lg leading-relaxed">{outcome.description}</p>
                </div>
              ))}
            </div>
            
            {/* Bonus Section */}
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12 text-center text-black">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Bonus Exclusif Inclus
                  </h3>
                  <p className="text-xl mb-6 opacity-90">
                    Accès à vie à notre communauté privée d'experts IA + 20 templates d'automatisation prêts à l'emploi (valeur 497€)
                  </p>
                  <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                    <span className="line-through opacity-70">497€</span>
                    <ArrowRight className="w-5 h-5" />
                    <span className="text-2xl font-bold">GRATUIT</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Super Strong */}
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
                  DERNIÈRES PLACES DISPONIBLES
                </Badge>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ne Manquez Pas Cette Opportunité
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  De Transformer Votre Vie
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-6 opacity-90 leading-relaxed">
                Dans 10 semaines, vous pourriez être en train d'automatiser des processus, créer des agents IA et <span className="font-bold text-yellow-300">multiplier votre valeur sur le marché</span>... Ou vous pourriez regarder les autres le faire.
              </p>
              
              {/* Value stack */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Formation Intensive 10 Semaines</div>
                      <div className="text-white/70">Programme complet + pratique</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Certification Officielle</div>
                      <div className="text-white/70">Reconnue par l'industrie</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Projet Portfolio</div>
                      <div className="text-white/70">Preuve concrète de vos compétences</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-lg mb-1">Communauté + Bonus</div>
                      <div className="text-white/70">Valeur totale: 497€ GRATUIT</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main CTA */}
              <div className="space-y-6">
                <Link 
                  to="/contact"
                  className="group relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-8 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl md:text-2xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Réserver Ma Place Maintenant</span>
                  <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 ml-2 sm:ml-3 relative z-10 group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Garantie satisfait ou remboursé 30 jours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/80">4.9/5 basé sur 142 avis vérifiés</span>
                  </div>
                </div>
              </div>
              
              {/* Urgency text */}
              <div className="mt-8 p-6 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                <p className="text-lg font-semibold">
                  ⚠️ Plus que <span className="text-yellow-300 text-2xl font-bold">7 places</span> disponibles pour la session de janvier 2026
                </p>
                <p className="text-white/80 mt-2">Les inscriptions ferment dans 72h</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIAutomationCourse;
