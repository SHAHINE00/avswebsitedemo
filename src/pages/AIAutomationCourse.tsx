import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Bot, Rocket, CheckCircle2, Clock, Award, Users, Target, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--academy-blue))] via-[hsl(var(--academy-purple))] to-[hsl(var(--academy-lightblue))]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Formation Professionnelle
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Formation Intégrée : de l'Ingénierie des Prompts à l'Automatisation Intelligente
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
                Maîtrisez l'IA, automatisez vos processus et créez des agents intelligents pour transformer votre carrière professionnelle
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="bg-white text-[hsl(var(--academy-blue))] px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  S'inscrire maintenant
                </Link>
                <Link 
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm"
                >
                  Programme complet
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 bg-[hsl(var(--academy-gray))]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                À propos de cette formation
              </h2>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Ce cours complet offre aux apprenants les compétences pratiques en intelligence artificielle, 
                    automatisation des tâches répétitives, et création d'agents intelligents. Il combine théorie et 
                    exercices pratiques pour optimiser la productivité et innover dans divers secteurs professionnels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Programme détaillé</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                4 modules progressifs pour une maîtrise complète de l'IA et de l'automatisation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {modules.map((module, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[hsl(var(--academy-blue))]">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-[hsl(var(--academy-blue))] text-white">
                        Module {index + 1}
                      </Badge>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {module.duration}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-4">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--academy-blue))] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="py-16 bg-[hsl(var(--academy-gray))]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Résultats attendus</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                À la fin de cette formation, vous serez capable de
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {outcomes.map((outcome, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                      {outcome.icon}
                    </div>
                    <CardTitle className="text-lg">{outcome.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{outcome.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[hsl(var(--academy-blue))] to-[hsl(var(--academy-purple))] text-white">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à transformer votre carrière ?
              </h2>
              <p className="text-xl mb-8 opacity-95">
                Rejoignez notre formation et développez des compétences recherchées en IA et automatisation. 
                Inscrivez-vous dès aujourd'hui pour ne pas manquer cette opportunité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="bg-white text-[hsl(var(--academy-blue))] px-10 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  S'inscrire maintenant
                </Link>
                <Link 
                  to="/contact"
                  className="border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center"
                >
                  Demander plus d'informations
                </Link>
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
