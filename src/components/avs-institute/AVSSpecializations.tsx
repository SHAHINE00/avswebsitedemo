import React, { useState } from 'react';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Code2, Calendar, BookOpen, Wrench } from 'lucide-react';

const AVSSpecializations = () => {
  const aiCurriculum = [
    {
      semester: 1,
      title: "Fondamentaux",
      description: "Introduction à l'intelligence artificielle, Python, mathématiques appliquées",
      modules: ["IA Fundamentals", "Python Programming", "Applied Mathematics", "Data Structures"]
    },
    {
      semester: 2,
      title: "Apprentissage automatique",
      description: "Algorithmes d'apprentissage, traitement des données, analyse statistique",
      modules: ["Machine Learning", "Data Processing", "Statistical Analysis", "Data Visualization"]
    },
    {
      semester: 3,
      title: "Applications avancées",
      description: "Réseaux de neurones, vision par ordinateur, traitement du langage naturel",
      modules: ["Neural Networks", "Computer Vision", "NLP", "Deep Learning"]
    },
    {
      semester: 4,
      title: "Projets finaux",
      description: "Projets d'application, déploiement dans le cloud, stage pratique",
      modules: ["Capstone Project", "Cloud Deployment", "Industry Internship", "Portfolio Development"]
    }
  ];

  const programmingCurriculum = [
    {
      semester: 1,
      title: "Fondamentaux de la programmation",
      description: "Python, HTML/CSS, JavaScript, bases de données",
      modules: ["Python Basics", "HTML/CSS", "JavaScript", "Database Fundamentals"]
    },
    {
      semester: 2,
      title: "Développement Web",
      description: "React, Node.js, Express, MongoDB, développement d'API",
      modules: ["React Framework", "Node.js", "Express.js", "API Development"]
    },
    {
      semester: 3,
      title: "Applications avancées",
      description: "Développement d'applications, DevOps, cybersécurité, tests",
      modules: ["App Development", "DevOps", "Cybersecurity", "Testing & QA"]
    },
    {
      semester: 4,
      title: "Projets finaux",
      description: "Projets intégrés, déploiement et hébergement, stage pratique",
      modules: ["Full-Stack Project", "Deployment", "Industry Internship", "Portfolio Building"]
    }
  ];

  const aiDomains = [
    "Intelligence Artificielle (IA) - Fondamentaux et applications",
    "Analyse de données",
    "Développement Cloud Computing",
    "Déploiement de frameworks modernes pour l'IA",
    "Apprentissage automatique - Algorithmes avancés",
    "IA générative",
    "Applications avancées intelligentes",
    "Gestion des données"
  ];

  const programmingDomains = [
    "Programmation Python - Langage de programmation de base et avancé",
    "Développement Web - HTML, CSS, JavaScript avancé",
    "Bases de données - SQL, NoSQL, et gestion de données",
    "React, Node.js",
    "Développement d'applications",
    "DevOps et solutions cloud",
    "Génie logiciel - Meilleures pratiques et modèles",
    "Déploiement et hébergement"
  ];

  const aiTools = ["TensorFlow", "PyTorch", "Jupyter Notebooks", "IBM Watson", "Azure AI", "Google Colab"];
  const programmingTools = ["Visual Studio Code", "React", "Node.js", "Django", "Python", "Docker", "Git & GitHub"];

  return (
    <SectionWrapper background="gray" padding="md">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-academy-blue via-academy-purple to-academy-lightblue bg-clip-text text-transparent">
            Nos Deux Spécialisations Techniques
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Diplômes de Technicien Spécialisé Bac+2 reconnus par l'État dans les technologies d'avenir
          </p>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 sm:mb-12 h-12 sm:h-16 mx-4 sm:mx-0">
            <TabsTrigger value="ai" className="text-sm sm:text-lg py-2 sm:py-4 data-[state=active]:bg-academy-blue data-[state=active]:text-white">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Technicien Spécialisé IA</span>
              <span className="sm:hidden">TS IA</span>
            </TabsTrigger>
            <TabsTrigger value="programming" className="text-sm sm:text-lg py-2 sm:py-4 data-[state=active]:bg-academy-purple data-[state=active]:text-white">
              <Code2 className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Technicien Spécialisé Programmation</span>
              <span className="sm:hidden">TS Prog</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-8">
            {/* AI Domains */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-blue">
                  <BookOpen className="w-8 h-8 mr-3" />
                  Domaines - Technicien Spécialisé IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {aiDomains.map((domain, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-academy-blue/5 rounded-lg border border-academy-blue/20">
                      <div className="w-2 h-2 bg-academy-blue rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-gray-700">{domain}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-blue">
                  <Calendar className="w-8 h-8 mr-3" />
                  Parcours Technicien Spécialisé IA - 4 Semestres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {aiCurriculum.map((semester, index) => (
                    <Card key={index} className="bg-gradient-to-br from-academy-blue/5 to-academy-blue/10 border-academy-blue/20">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
                          <Badge className="bg-academy-blue text-white mr-0 sm:mr-3 w-fit">
                            Semestre {semester.semester}
                          </Badge>
                          <h3 className="text-lg sm:text-xl font-bold text-academy-blue">{semester.title}</h3>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-4">{semester.description}</p>
                        <div className="space-y-2">
                          {semester.modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="text-xs sm:text-sm text-gray-600 bg-white/50 px-2 sm:px-3 py-1 rounded-md">
                              {module}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-blue">
                  <Wrench className="w-8 h-8 mr-3" />
                  Outils Professionnels - Technicien Spécialisé IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {aiTools.map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-academy-blue border-academy-blue/30 bg-academy-blue/5 px-4 py-2 text-base">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programming" className="space-y-8">
            {/* Programming Domains */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-purple">
                  <BookOpen className="w-8 h-8 mr-3" />
                  Domaines - Technicien Spécialisé Programmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programmingDomains.map((domain, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-academy-purple/5 rounded-lg border border-academy-purple/20">
                      <div className="w-2 h-2 bg-academy-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{domain}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Programming Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-purple">
                  <Calendar className="w-8 h-8 mr-3" />
                  Parcours Technicien Spécialisé Programmation - 4 Semestres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programmingCurriculum.map((semester, index) => (
                    <Card key={index} className="bg-gradient-to-br from-academy-purple/5 to-academy-purple/10 border-academy-purple/20">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Badge className="bg-academy-purple text-white mr-3">
                            Semestre {semester.semester}
                          </Badge>
                          <h3 className="text-xl font-bold text-academy-purple">{semester.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{semester.description}</p>
                        <div className="space-y-2">
                          {semester.modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-md">
                              {module}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Programming Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-academy-purple">
                  <Wrench className="w-8 h-8 mr-3" />
                  Outils Professionnels - Technicien Spécialisé Programmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {programmingTools.map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-academy-purple border-academy-purple/30 bg-academy-purple/5 px-4 py-2 text-base">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SectionWrapper>
  );
};

export default AVSSpecializations;