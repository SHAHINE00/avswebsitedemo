
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, BookOpen, Target, Users, Award } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Programme de Formation en Intelligence Artificielle</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Bienvenue dans notre programme de formation en Intelligence Artificielle. Découvrez les détails du cursus qui vous préparera à exceller dans le domaine de l'IA.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        {/* Table of Contents */}
        <section className="py-12 bg-academy-gray">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Sommaire</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="#presentation" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">I. Présentation du Programme de Formation</span>
                  </a>
                  <a href="#synthese" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">II. Synthèse du Programme de Formation</span>
                  </a>
                  <a href="#buts" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">III. Buts du Programme de Formation</span>
                  </a>
                  <a href="#objectifs" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">IV. Objectifs Généraux</span>
                  </a>
                  <a href="#curriculum" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">V. Curriculum 1ère Année</span>
                  </a>
                  <a href="#curriculum2" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">VI. Curriculum 2ème Année</span>
                  </a>
                  <a href="#strategies" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">IX. Stratégies Pédagogiques et Système d'Évaluation</span>
                  </a>
                  <a href="#bibliographie" className="flex items-center p-3 rounded-lg hover:bg-academy-gray transition-colors">
                    <span className="font-medium">X. Bibliographie</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Program Presentation */}
        <section id="presentation" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">I. Présentation du Programme de Formation</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-academy-blue" />
                    Programme de formation professionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Notre programme de formation en Intelligence Artificielle est conçu pour former des professionnels compétents 
                    capables de maîtriser les technologies IA les plus avancées et de les appliquer dans des contextes professionnels variés.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-6 h-6 mr-2 text-academy-blue" />
                    Buts de la formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Former des spécialistes en IA capables de concevoir, développer et déployer des solutions d'intelligence artificielle 
                    innovantes répondant aux besoins du marché du travail actuel et futur.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-6 h-6 mr-2 text-academy-blue" />
                    Compétences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Développement de compétences techniques et transversales en programmation Python, machine learning, 
                    deep learning, traitement de données, et déploiement de modèles IA.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-6 h-6 mr-2 text-academy-blue" />
                    Public Cible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Étudiants diplômés, professionnels en reconversion, ingénieurs souhaitant se spécialiser en IA, 
                    et toute personne passionnée par les technologies d'intelligence artificielle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Synthesis */}
        <section id="synthese" className="py-16 bg-academy-gray">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">II. Synthèse du Programme de Formation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tableau 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Synthèse du Programme de Formation - 1ère Année</p>
                  <p className="text-sm text-gray-600 mt-2">14 modules - 10 mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tableau 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Synthèse du Programme de Formation - 2ème Année</p>
                  <p className="text-sm text-gray-600 mt-2">13 modules - 10 mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tableau 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Synthèse du Programme de Formation - Total 2 Ans</p>
                  <p className="text-sm text-gray-600 mt-2">27 modules - 20 mois</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Goals */}
        <section id="buts" className="py-16">
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

        {/* General Objectives */}
        <section id="objectifs" className="py-16 bg-academy-gray">
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

        {/* First Year Curriculum */}
        <section id="curriculum" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">V. Curriculum 1ère Année (10 mois)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {firstYearModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-academy-blue text-white px-2 py-1 rounded text-xs font-semibold mr-2">
                        {module.code}
                      </span>
                      <span className="text-xs text-gray-600">{module.duration}</span>
                    </div>
                    <h3 className="text-sm font-bold text-academy-blue leading-tight">{module.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Second Year Curriculum */}
        <section id="curriculum2" className="py-16 bg-academy-gray">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">VI. Curriculum 2ème Année (10 mois)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondYearModules.map((module, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-academy-purple text-white px-2 py-1 rounded text-xs font-semibold mr-2">
                        {module.code}
                      </span>
                      <span className="text-xs text-gray-600">{module.duration}</span>
                    </div>
                    <h3 className="text-sm font-bold text-academy-purple leading-tight">{module.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Teaching Strategies */}
        <section id="strategies" className="py-16">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">IX. Stratégies Pédagogiques et Système d'Évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-academy-blue">Approches Pédagogiques</h3>
                    <p className="text-gray-700 mb-4">
                      Notre approche combine cours magistraux, travaux pratiques, projets en équipe et stages en entreprise. 
                      L'accent est mis sur l'apprentissage par la pratique avec des projets concrets utilisant des données réelles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-academy-blue">Système d'Évaluation</h3>
                    <p className="text-gray-700">
                      L'évaluation se base sur un contrôle continu incluant des examens théoriques, des projets pratiques, 
                      des présentations orales et un projet de fin d'études. Chaque module est évalué selon des critères 
                      spécifiques adaptés à ses objectifs pédagogiques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bibliography */}
        <section id="bibliographie" className="py-16 bg-academy-gray">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">X. Bibliographie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Les références bibliographiques incluent les ouvrages de référence en intelligence artificielle, 
                  machine learning, et deep learning, ainsi que les publications scientifiques récentes et les 
                  ressources en ligne spécialisées.
                </p>
                <p className="text-sm text-gray-600">
                  Une bibliographie détaillée sera fournie au début de chaque module avec les ressources spécifiques 
                  nécessaires pour approfondir les sujets traités.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Card className="max-w-4xl mx-auto text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Prêt à démarrer votre parcours en IA ?</h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Rejoignez notre programme de formation en Intelligence Artificielle et transformez votre carrière 
                  avec les compétences les plus demandées du marché.
                </p>
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                  <Link to="/register">
                    S'inscrire maintenant <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourse;
