import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Shield, Target, Database, Cloud, Palette, Briefcase, Clock, Award, Users, ArrowRight, RefreshCw } from 'lucide-react';

interface CourseInfo {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  feature1: string;
  feature2: string;
  icon: string;
  link?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  courses: CourseInfo[];
  icon: React.ReactNode;
  color: string;
  careerOutcomes: string[];
}

const EnhancedCourseSelectionGuide: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<LearningPath[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'domain',
      question: "Quel domaine vous intéresse le plus ?",
      options: [
        { value: 'ai-data', label: "Intelligence Artificielle & Data Science" },
        { value: 'programming', label: "Programmation & Développement" },
        { value: 'cybersecurity', label: "Cybersécurité & Protection" },
        { value: 'marketing', label: "Marketing Digital & E-commerce" },
        { value: 'multiple', label: "Plusieurs domaines m'intéressent" }
      ]
    },
    {
      id: 'experience',
      question: "Quel est votre niveau d'expérience ?",
      options: [
        { value: 'beginner', label: "Débutant - peu ou pas d'expérience" },
        { value: 'intermediate', label: "Intermédiaire - bases solides" },
        { value: 'advanced', label: "Avancé - expérience professionnelle" }
      ]
    },
    {
      id: 'timeCommitment',
      question: "Combien de temps pouvez-vous consacrer à votre formation ?",
      options: [
        { value: 'short', label: "3-4 mois (temps partiel)" },
        { value: 'medium', label: "6-12 mois (formation intensive)" },
        { value: 'long', label: "12+ mois (formation complète)" }
      ]
    },
    {
      id: 'goal',
      question: "Quel est votre objectif principal ?",
      options: [
        { value: 'career-change', label: "Reconversion professionnelle complète" },
        { value: 'skill-upgrade', label: "Améliorer mes compétences actuelles" },
        { value: 'specialization', label: "Me spécialiser dans un domaine précis" },
        { value: 'entrepreneurship', label: "Lancer mon propre projet/entreprise" }
      ]
    },
    {
      id: 'learningStyle',
      question: "Comment préférez-vous apprendre ?",
      options: [
        { value: 'practical', label: "Projets pratiques et hands-on" },
        { value: 'theoretical', label: "Bases théoriques solides d'abord" },
        { value: 'business', label: "Applications business et cas concrets" },
        { value: 'mixed', label: "Mélange théorie-pratique équilibré" }
      ]
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'ai-complete',
      title: 'Parcours IA & Data Science Complet',
      description: 'Formation complète pour devenir expert en intelligence artificielle et science des données',
      duration: '18-24 mois',
      level: 'Débutant',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      careerOutcomes: ['Data Scientist', 'AI Engineer', 'ML Engineer', 'Business Intelligence Analyst'],
      courses: [
        { id: '1', title: 'Formation IA', subtitle: 'Intelligence Artificielle', duration: '18 mois', feature1: 'Machine Learning', feature2: 'Big Data', icon: 'brain', link: '/ai-course' },
        { id: '2', title: 'AI & Machine Learning Engineering', subtitle: 'Ingénierie IA & ML', duration: '6 mois', feature1: 'Modèles ML en production', feature2: 'Architecture IA scalable', icon: 'brain', link: '/course/ai-ml-engineering' },
        { id: '3', title: 'Data Science for Business', subtitle: 'Science des données appliquée', duration: '6 mois', feature1: 'KPI business', feature2: 'Modèles prédictifs ROI', icon: 'database', link: '/course/data-science-business' }
      ]
    },
    {
      id: 'programming-fullstack',
      title: 'Parcours Développement Full Stack',
      description: 'Devenez développeur full stack avec les technologies modernes',
      duration: '12-18 mois',
      level: 'Débutant',
      icon: <Code className="w-6 h-6" />,
      color: 'from-purple-500 to-blue-500',
      careerOutcomes: ['Full Stack Developer', 'Web Developer', 'Mobile Developer', 'DevOps Engineer'],
      courses: [
        { id: '4', title: 'Formation Programmation', subtitle: 'Développement Web & Mobile', duration: '24 semaines', feature1: 'Full Stack', feature2: 'DevOps', icon: 'code', link: '/programming-course' },
        { id: '5', title: 'Web Development', subtitle: 'Développement web moderne', duration: '6 mois', feature1: 'React, Vue', feature2: 'Responsive design', icon: 'code', link: '/course/web-development' },
        { id: '6', title: 'Mobile App Development', subtitle: 'Applications mobiles', duration: '6 mois', feature1: 'iOS et Android', feature2: 'React Native', icon: 'code', link: '/course/mobile-app-development' }
      ]
    },
    {
      id: 'cybersecurity-expert',
      title: 'Parcours Cybersécurité Expert',
      description: 'Formation spécialisée en sécurité informatique et ethical hacking',
      duration: '12-15 mois',
      level: 'Intermédiaire',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      careerOutcomes: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Consultant', 'CISO'],
      courses: [
        { id: '7', title: 'Formation Cybersécurité', subtitle: 'Sécurité Informatique', duration: '12 mois', feature1: 'Ethical Hacking', feature2: 'Network Security', icon: 'shield', link: '/cybersecurity-course' },
        { id: '8', title: 'Ethical AI & Governance', subtitle: 'IA responsable et éthique', duration: '3 mois', feature1: 'Biais algorithmiques', feature2: 'Conformité IA', icon: 'shield', link: '/course/ethical-ai-governance' }
      ]
    },
    {
      id: 'business-intelligence',
      title: 'Parcours Business Intelligence',
      description: 'Transformez les données en insights stratégiques pour l\'entreprise',
      duration: '9-12 mois',
      level: 'Intermédiaire',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      careerOutcomes: ['Business Analyst', 'Data Analyst', 'BI Developer', 'Data Consultant'],
      courses: [
        { id: '9', title: 'Business Intelligence', subtitle: 'Insights stratégiques', duration: '4 mois', feature1: 'Tableaux de bord', feature2: 'Analyse prédictive', icon: 'target', link: '/course/business-intelligence' },
        { id: '10', title: 'Data Analysis with Microsoft Excel', subtitle: 'Analyse avancée Excel', duration: '3 mois', feature1: 'Tableaux croisés', feature2: 'Macros VBA', icon: 'database', link: '/course/excel-data-analysis' },
        { id: '11', title: 'Financial Data Analysis', subtitle: 'Analyse financière', duration: '4 mois', feature1: 'Modèles financiers', feature2: 'Risk management', icon: 'target', link: '/course/financial-data-analysis' }
      ]
    },
    {
      id: 'ai-specialist',
      title: 'Parcours Spécialisation IA',
      description: 'Spécialisations avancées en intelligence artificielle',
      duration: '6-9 mois',
      level: 'Avancé',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-500',
      careerOutcomes: ['AI Specialist', 'Computer Vision Engineer', 'AI Consultant', 'Research Scientist'],
      courses: [
        { id: '12', title: 'Computer Vision with OpenCV', subtitle: 'Vision par ordinateur', duration: '5 mois', feature1: 'Détection d\'objets', feature2: 'Temps réel', icon: 'brain', link: '/course/computer-vision-opencv' },
        { id: '13', title: 'AI Applications in Industries', subtitle: 'IA industrielle', duration: '5 mois', feature1: 'Santé, finance, retail', feature2: 'Cas d\'usage concrets', icon: 'brain', link: '/course/ai-applications-industries' },
        { id: '14', title: 'AI for Decision Making', subtitle: 'IA décisionnelle', duration: '4 mois', feature1: 'Algorithmes de recommandation', feature2: 'Systèmes d\'aide', icon: 'target', link: '/course/ai-decision-making' }
      ]
    },
    {
      id: 'cloud-devops',
      title: 'Parcours Cloud & DevOps',
      description: 'Architecture cloud et méthodologies DevOps modernes',
      duration: '9-12 mois',
      level: 'Intermédiaire',
      icon: <Cloud className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600',
      careerOutcomes: ['Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer', 'Infrastructure Engineer'],
      courses: [
        { id: '15', title: 'Cloud Computing (AWS, Azure)', subtitle: 'Architecture cloud', duration: '7 mois', feature1: 'AWS et Azure', feature2: 'Kubernetes', icon: 'cloud', link: '/course/cloud-computing' },
        { id: '16', title: 'Database Design & Management', subtitle: 'Gestion de bases de données', duration: '5 mois', feature1: 'Modélisation', feature2: 'Optimisation', icon: 'database', link: '/course/database-design-management' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const generateRecommendations = () => {
    const { domain, experience, timeCommitment, goal, learningStyle } = selectedAnswers;
    let recommendedPaths: LearningPath[] = [];

    // Logic pour recommandations basées sur les réponses
    if (domain === 'ai-data') {
      if (experience === 'beginner') {
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
        recommendedPaths.push(learningPaths.find(p => p.id === 'business-intelligence')!);
      } else if (experience === 'advanced') {
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-specialist')!);
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
      } else {
        recommendedPaths.push(learningPaths.find(p => p.id === 'business-intelligence')!);
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
      }
    } else if (domain === 'programming') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'programming-fullstack')!);
      if (experience !== 'beginner') {
        recommendedPaths.push(learningPaths.find(p => p.id === 'cloud-devops')!);
      }
    } else if (domain === 'cybersecurity') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'cybersecurity-expert')!);
    } else if (domain === 'multiple') {
      if (goal === 'career-change') {
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
        recommendedPaths.push(learningPaths.find(p => p.id === 'programming-fullstack')!);
      } else {
        recommendedPaths.push(learningPaths.find(p => p.id === 'business-intelligence')!);
        recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
      }
    }

    // Ajuster selon l'objectif
    if (goal === 'entrepreneurship') {
      const businessPath = learningPaths.find(p => p.id === 'business-intelligence');
      if (businessPath && !recommendedPaths.includes(businessPath)) {
        recommendedPaths.unshift(businessPath);
      }
    }

    // Assurer qu'on a au moins 2 recommandations
    if (recommendedPaths.length < 2) {
      learningPaths.forEach(path => {
        if (recommendedPaths.length < 3 && !recommendedPaths.includes(path)) {
          recommendedPaths.push(path);
        }
      });
    }

    setRecommendations(recommendedPaths.slice(0, 3));
    setShowResults(true);
    
    // Smooth scroll to results after state update
    setTimeout(() => {
      const resultsElement = document.getElementById('course-recommendations-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const resetGuide = () => {
    setSelectedAnswers({});
    setRecommendations([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <section id="course-recommendations-results" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vos Parcours Recommandés
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Voici les parcours de formation les mieux adaptés à votre profil et vos objectifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-12">
            {recommendations.map((path, index) => (
              <Card key={path.id} className={`relative overflow-hidden border-0 shadow-xl ${index === 0 ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                {index === 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-blue-500 text-white text-xs">Recommandé</Badge>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                <CardHeader className="pb-4 p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className={`p-1.5 md:p-2 rounded-lg bg-gradient-to-r ${path.color} text-white`}>
                      {path.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">{path.level}</Badge>
                  </div>
                  <CardTitle className="text-lg md:text-xl leading-tight">{path.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Durée : {path.duration}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Débouchés
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {path.careerOutcomes.slice(0, 2).map((outcome, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{outcome}</Badge>
                      ))}
                      {path.careerOutcomes.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{path.careerOutcomes.length - 2}</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Formations incluses</h4>
                    <div className="space-y-2">
                      {path.courses.slice(0, 2).map((course, i) => (
                        <div key={i} className="text-xs p-2 bg-gray-50 rounded">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-gray-600">{course.duration}</div>
                        </div>
                      ))}
                      {path.courses.length > 2 && (
                        <div className="text-xs text-center text-gray-500">
                          +{path.courses.length - 2} autres formations
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild 
                    className={`w-full bg-gradient-to-r ${path.color} text-white hover:opacity-90`}
                  >
                    <Link to={path.courses[0]?.link || '/curriculum'}>
                      Découvrir ce parcours
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={resetGuide}
              className="border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recommencer le test
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="course-guide" className="py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-gray-50 to-blue-50 mt-0 pt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-academy-blue/10 rounded-full mb-6">
            <Target className="w-8 h-8 text-academy-blue" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
            Quelle formation vous convient le mieux ?
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez le parcours de formation idéal parmi nos 26+ cours spécialisés. 
            Répondez à quelques questions pour obtenir des recommandations personnalisées.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-100 text-gray-800">
              <CardTitle className="text-xl">Guide de Sélection Personnalisé</CardTitle>
              <CardDescription className="text-gray-600">
                5 questions pour identifier votre parcours optimal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="space-y-6 md:space-y-8">
                {questions.map((q, qIndex) => (
                  <div key={q.id} className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-academy-blue to-academy-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                        {qIndex + 1}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg leading-tight">{q.question}</h3>
                    </div>
                    <div className="ml-0 md:ml-11 space-y-2 md:space-y-3">
                      {q.options.map((option) => (
                        <label 
                          key={option.value} 
                          className={`flex items-start p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all cursor-pointer hover:bg-blue-50 ${
                            selectedAnswers[q.id] === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={option.value}
                            checked={selectedAnswers[q.id] === option.value}
                            onChange={() => handleAnswerSelect(q.id, option.value)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedAnswers[q.id] === option.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswers[q.id] === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="font-medium text-sm md:text-base leading-tight">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 md:p-8">
              <div className="w-full space-y-3">
                <Button 
                  onClick={generateRecommendations}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base md:text-lg font-semibold"
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                >
                  <Award className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Obtenir mes recommandations personnalisées</span>
                  <span className="sm:hidden">Obtenir mes recommandations</span>
                </Button>
                {Object.keys(selectedAnswers).length < questions.length && (
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    Répondez à toutes les questions pour continuer ({Object.keys(selectedAnswers).length}/{questions.length})
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCourseSelectionGuide;