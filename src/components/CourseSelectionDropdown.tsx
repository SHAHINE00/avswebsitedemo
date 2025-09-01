import React from 'react';
import { useSafeState } from '@/utils/safeHooks';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Brain, Code, Shield, Target, Database, Cloud, ChevronDown, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const CourseSelectionDropdown: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useSafeState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useSafeState<LearningPath[]>([]);
  const [showResults, setShowResults] = useSafeState(false);
  const [isOpen, setIsOpen] = useSafeState(false);
  const [currentQuestion, setCurrentQuestion] = useSafeState(0);

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
      id: 'goal',
      question: "Quel est votre objectif principal ?",
      options: [
        { value: 'career-change', label: "Reconversion professionnelle complète" },
        { value: 'skill-upgrade', label: "Améliorer mes compétences actuelles" },
        { value: 'specialization', label: "Me spécialiser dans un domaine précis" },
        { value: 'entrepreneurship', label: "Lancer mon propre projet/entreprise" }
      ]
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'ai-complete',
      title: 'Parcours IA & Data Science',
      description: 'Formation complète en intelligence artificielle et science des données',
      duration: '18-24 mois',
      level: 'Débutant',
      icon: <Brain className="w-4 h-4" />,
      color: 'from-blue-500 to-purple-600',
      careerOutcomes: ['Data Scientist', 'AI Engineer', 'ML Engineer'],
      courses: [
        { id: '1', title: 'Technicien Spécialisé IA', subtitle: 'Intelligence Artificielle', duration: '2 ans', feature1: 'Machine Learning', feature2: 'Big Data', icon: 'brain', link: '/ai-course' }
      ]
    },
    {
      id: 'programming-fullstack',
      title: 'Développement Full Stack',
      description: 'Devenez développeur full stack avec les technologies modernes',
      duration: '12-18 mois',
      level: 'Débutant',
      icon: <Code className="w-4 h-4" />,
      color: 'from-purple-500 to-blue-500',
      careerOutcomes: ['Full Stack Developer', 'Web Developer', 'Mobile Developer'],
      courses: [
        { id: '4', title: 'Technicien Spécialisé Programmation', subtitle: 'Développement Web & Mobile', duration: '2 ans', feature1: 'Full Stack', feature2: 'DevOps', icon: 'code', link: '/programming-course' }
      ]
    },
    {
      id: 'cybersecurity-expert',
      title: 'Cybersécurité Expert',
      description: 'Formation spécialisée en sécurité informatique',
      duration: '12-15 mois',
      level: 'Intermédiaire',
      icon: <Shield className="w-4 h-4" />,
      color: 'from-red-500 to-orange-500',
      careerOutcomes: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Consultant'],
      courses: [
        { id: '7', title: 'Formation Cybersécurité', subtitle: 'Sécurité Informatique', duration: '12 mois', feature1: 'Ethical Hacking', feature2: 'Network Security', icon: 'shield', link: '/cybersecurity-course' }
      ]
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence',
      description: 'Transformez les données en insights stratégiques',
      duration: '9-12 mois',
      level: 'Intermédiaire',
      icon: <Target className="w-4 h-4" />,
      color: 'from-blue-500 to-indigo-600',
      careerOutcomes: ['Business Analyst', 'Data Analyst', 'BI Developer'],
      courses: [
        { id: '9', title: 'Business Intelligence', subtitle: 'Insights stratégiques', duration: '4 mois', feature1: 'Tableaux de bord', feature2: 'Analyse prédictive', icon: 'target', link: '/course/business-intelligence' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Auto-advance to next question or generate recommendations
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateRecommendations();
    }
  };

  const generateRecommendations = () => {
    const { domain, experience, goal } = selectedAnswers;
    let recommendedPaths: LearningPath[] = [];

    // Simple recommendation logic
    if (domain === 'ai-data') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
      recommendedPaths.push(learningPaths.find(p => p.id === 'business-intelligence')!);
    } else if (domain === 'programming') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'programming-fullstack')!);
    } else if (domain === 'cybersecurity') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'cybersecurity-expert')!);
    } else if (domain === 'multiple') {
      recommendedPaths.push(learningPaths.find(p => p.id === 'ai-complete')!);
      recommendedPaths.push(learningPaths.find(p => p.id === 'programming-fullstack')!);
    }

    // Ensure at least 2 recommendations
    if (recommendedPaths.length < 2) {
      learningPaths.forEach(path => {
        if (recommendedPaths.length < 2 && !recommendedPaths.includes(path)) {
          recommendedPaths.push(path);
        }
      });
    }

    setRecommendations(recommendedPaths.slice(0, 2));
    setShowResults(true);
  };

  const resetGuide = () => {
    setSelectedAnswers({});
    setRecommendations([]);
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const isCompleted = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full md:w-auto bg-gradient-to-r from-academy-blue to-academy-purple text-white border-0 hover:opacity-90"
          >
            <Target className="w-4 h-4 mr-2" />
            Guide de Sélection Personnalisé
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 md:w-96 p-0 bg-background border shadow-xl z-50" 
          align="start"
          sideOffset={8}
        >
          {!showResults ? (
            <div className="p-4 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} sur {questions.length}</span>
                <div className="flex space-x-1">
                  {questions.map((_, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        index <= currentQuestion ? "bg-academy-blue" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Current Question */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm leading-tight">
                  {getCurrentQuestion()?.question}
                </h3>
                
                <div className="space-y-2">
                  {getCurrentQuestion()?.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerSelect(getCurrentQuestion().id, option.value)}
                      className={cn(
                        "w-full text-left p-2 rounded-md text-xs hover:bg-accent transition-colors",
                        selectedAnswers[getCurrentQuestion().id] === option.value && "bg-academy-blue/10 border border-academy-blue"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {isCompleted && (
                <>
                  <DropdownMenuSeparator />
                  <Button 
                    onClick={generateRecommendations}
                    className="w-full bg-academy-blue hover:bg-academy-blue/90 text-white text-xs"
                  >
                    Voir mes recommandations
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-2">Vos Parcours Recommandés</h3>
              </div>

              <div className="space-y-3">
                {recommendations.map((path, index) => (
                  <Card key={path.id} className="border border-gray-200">
                    <CardHeader className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded bg-gradient-to-r ${path.color} text-white`}>
                          {path.icon}
                        </div>
                        <Badge variant="outline" className="text-xs">{path.level}</Badge>
                        {index === 0 && (
                          <Badge className="bg-academy-blue text-white text-xs">Top</Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm leading-tight">{path.title}</CardTitle>
                      <CardDescription className="text-xs text-gray-600">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {path.careerOutcomes.slice(0, 2).map((outcome, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{outcome}</Badge>
                        ))}
                      </div>
                      <Button 
                        asChild 
                        size="sm"
                        className={`w-full bg-gradient-to-r ${path.color} text-white hover:opacity-90 text-xs`}
                      >
                        <Link to={path.courses[0]?.link || '/curriculum'}>
                          Découvrir
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <DropdownMenuSeparator />
              
              <Button 
                variant="outline" 
                onClick={resetGuide}
                className="w-full text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Recommencer
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CourseSelectionDropdown;