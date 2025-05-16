
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const CourseSelectionGuide: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const questions = [
    {
      id: 'interest',
      question: "Quel domaine vous intéresse le plus ?",
      options: [
        { value: 'ia', label: "L'intelligence artificielle et l'analyse de données" },
        { value: 'programming', label: "Le développement d'applications web et mobile" },
        { value: 'both', label: "Les deux domaines m'intéressent" }
      ]
    },
    {
      id: 'experience',
      question: "Quel est votre niveau d'expérience en programmation ?",
      options: [
        { value: 'beginner', label: "Débutant - peu ou pas d'expérience" },
        { value: 'intermediate', label: "Intermédiaire - bases solides en programmation" },
        { value: 'advanced', label: "Avancé - expérience professionnelle" }
      ]
    },
    {
      id: 'goal',
      question: "Quel est votre objectif principal ?",
      options: [
        { value: 'career', label: "Commencer une nouvelle carrière en tech" },
        { value: 'skills', label: "Améliorer mes compétences actuelles" },
        { value: 'project', label: "Travailler sur un projet spécifique" }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleGetRecommendation = () => {
    const { interest, experience } = selectedAnswers;
    
    if (interest === 'both') {
      setRecommendation("double");
    } else if (interest === 'ia') {
      if (experience === 'beginner') {
        setRecommendation("ia-with-programming-basics");
      } else {
        setRecommendation("ia");
      }
    } else {
      setRecommendation("programming");
    }
  };

  const renderRecommendation = () => {
    switch (recommendation) {
      case 'ia':
        return (
          <Card className="border-academy-blue">
            <CardHeader className="bg-academy-blue/10">
              <CardTitle className="text-academy-blue">Formation Intelligence Artificielle</CardTitle>
              <CardDescription>La meilleure option pour vous</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Basé sur vos réponses, nous recommandons notre <strong>Formation IA</strong>. 
                Cette formation vous permettra d'acquérir les compétences nécessaires en machine learning, 
                deep learning et traitement de données.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Programme complet de 4 modules</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Projets pratiques en IA</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Certification reconnue</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-academy-blue hover:bg-academy-purple">
                <Link to="/ai-course">Découvrir la formation IA</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'programming':
        return (
          <Card className="border-academy-purple">
            <CardHeader className="bg-academy-purple/10">
              <CardTitle className="text-academy-purple">Formation Programmation</CardTitle>
              <CardDescription>La meilleure option pour vous</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Basé sur vos réponses, nous recommandons notre <strong>Formation Programmation</strong>. 
                Cette formation vous permettra de maîtriser le développement d'applications web et mobile modernes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-academy-purple mr-2">✓</span>
                  <span>Programme complet de 4 modules</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-purple mr-2">✓</span>
                  <span>Projets pratiques en développement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-purple mr-2">✓</span>
                  <span>Certification reconnue</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-academy-purple hover:bg-academy-blue">
                <Link to="/programming-course">Découvrir la formation Programmation</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'ia-with-programming-basics':
        return (
          <Card className="border-academy-blue">
            <CardHeader className="bg-gradient-to-r from-academy-blue/10 to-academy-purple/10">
              <CardTitle className="text-academy-blue">Formation IA avec fondamentaux de programmation</CardTitle>
              <CardDescription>La meilleure option pour vous</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Basé sur vos réponses, nous recommandons notre <strong>Formation IA</strong> avec 
                une attention particulière aux modules de fondamentaux de programmation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Inclut une introduction à la programmation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Progression adaptée aux débutants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-academy-blue mr-2">✓</span>
                  <span>Focus sur les compétences IA</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-academy-blue hover:bg-academy-purple">
                <Link to="/ai-course">Découvrir la formation IA</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'double':
        return (
          <Card className="border-gray-300">
            <CardHeader className="bg-gradient-to-r from-academy-blue/10 to-academy-purple/10">
              <CardTitle>Programme Double Formation</CardTitle>
              <CardDescription>La solution complète</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Basé sur vos réponses, nous vous suggérons d'envisager nos <strong>deux formations</strong>.
                Commencez par la programmation pour acquérir des bases solides, puis continuez avec l'IA.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border border-academy-purple rounded-lg p-4">
                  <h4 className="font-bold text-academy-purple mb-2">1. Formation Programmation</h4>
                  <p className="text-sm">Acquérir des compétences solides en développement</p>
                </div>
                <div className="border border-academy-blue rounded-lg p-4">
                  <h4 className="font-bold text-academy-blue mb-2">2. Formation IA</h4>
                  <p className="text-sm">Spécialisation en intelligence artificielle</p>
                </div>
              </div>
              <p className="text-sm italic">
                Contactez un conseiller pour discuter d'un parcours personnalisé combinant nos deux formations.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button asChild className="w-full bg-academy-blue hover:bg-academy-purple">
                <Link to="/contact">Demander une consultation</Link>
              </Button>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button asChild variant="outline" className="border-academy-purple text-academy-purple">
                  <Link to="/programming-course">Formation Programmation</Link>
                </Button>
                <Button asChild variant="outline" className="border-academy-blue text-academy-blue">
                  <Link to="/ai-course">Formation IA</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="course-guide" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quelle formation vous convient le mieux ?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Répondez à ces quelques questions pour obtenir une recommandation personnalisée basée sur votre profil et vos objectifs.
          </p>
        </div>
        
        {recommendation ? (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Notre recommandation</h3>
            {renderRecommendation()}
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => setRecommendation(null)}
                className="border-gray-300"
              >
                Recommencer
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Guide de choix de formation</CardTitle>
                <CardDescription>Répondez à ces questions pour obtenir une recommandation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <h3 className="font-medium text-lg">{q.question}</h3>
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              id={`${q.id}-${option.value}`}
                              name={q.id}
                              value={option.value}
                              checked={selectedAnswers[q.id] === option.value}
                              onChange={() => handleAnswerSelect(q.id, option.value)}
                              className="mr-3 w-4 h-4 text-academy-blue"
                            />
                            <label htmlFor={`${q.id}-${option.value}`}>{option.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGetRecommendation} 
                  className="w-full bg-academy-blue hover:bg-academy-purple"
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                >
                  Obtenir ma recommandation
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSelectionGuide;
