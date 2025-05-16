
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Code } from 'lucide-react';

const CourseComparison: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Choisissez votre parcours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* IA Course */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:border-academy-blue transition-all">
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-academy-blue mr-3" />
              <h3 className="text-2xl font-bold text-academy-blue">Formation IA</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Plongez dans le monde fascinant de l'intelligence artificielle et apprenez à créer des solutions innovantes.
            </p>
            
            {/* Duration badge */}
            <div className="bg-academy-blue/10 text-academy-blue rounded-lg px-4 py-2 inline-block mb-6">
              <span className="font-semibold">Durée: 2 ans</span> (théorie et projets pratiques)
            </div>
            
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-academy-blue mr-2">✓</span>
                <span>Machine Learning et Deep Learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-blue mr-2">✓</span>
                <span>Traitement du langage naturel</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-blue mr-2">✓</span>
                <span>Vision par ordinateur</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-blue mr-2">✓</span>
                <span>Systèmes de recommandation</span>
              </li>
            </ul>
            <Button asChild className="w-full bg-academy-blue hover:bg-academy-purple rounded-xl">
              <Link to="/ai-course">Découvrir le programme</Link>
            </Button>
          </div>
          
          {/* Programming Course */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:border-academy-purple transition-all">
            <div className="flex items-center mb-4">
              <Code className="w-8 h-8 text-academy-purple mr-3" />
              <h3 className="text-2xl font-bold text-academy-purple">Formation Programmation</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Maîtrisez les langages et technologies les plus demandés pour développer des applications web et mobile modernes.
            </p>
            
            {/* Duration badge */}
            <div className="bg-academy-purple/10 text-academy-purple rounded-lg px-4 py-2 inline-block mb-6">
              <span className="font-semibold">Durée: 2 ans</span> (théorie et projets pratiques)
            </div>
            
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-academy-purple mr-2">✓</span>
                <span>Développement web fullstack</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-purple mr-2">✓</span>
                <span>Applications mobiles iOS et Android</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-purple mr-2">✓</span>
                <span>Architectures logicielles modernes</span>
              </li>
              <li className="flex items-start">
                <span className="text-academy-purple mr-2">✓</span>
                <span>DevOps et déploiement</span>
              </li>
            </ul>
            <Button asChild className="w-full bg-academy-purple hover:bg-academy-blue rounded-xl">
              <Link to="/programming-course">Découvrir le programme</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseComparison;
