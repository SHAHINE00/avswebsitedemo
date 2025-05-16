
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, BookOpen, Code } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="pt-28 pb-0 md:pt-32 md:pb-0 bg-gradient-to-br from-white to-academy-gray">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="flex items-center mb-4">
            <span className="inline-block px-3 py-1 bg-academy-blue/10 text-academy-blue rounded-full text-sm font-medium">
              Inscriptions ouvertes
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-center md:text-left">
            <span className="gradient-text">L'Avenir de la Technologie Commence Ici Explorez Apprenez Innovez</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            AVS l'institut de l'Innovation et de l'Intelligence Artificielle - Maîtriser les technologies d'IA et de Programmation de pointe grâce à notre formation la plus complète. Rejoignez les milliers de développements qui boostent votre carrière dans l'industrie de l'IA et de la programmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg rounded-xl">
              <Link to="/register">S'inscrire</Link>
            </Button>
            <Button asChild variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-8 py-6 text-lg rounded-xl">
              <Link to="/video">
                <Video className="mr-2" />
                Regarde le video
              </Link>
            </Button>
          </div>

          {/* Course Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            <Link to="/ai-course" className="flex items-center p-6 bg-white rounded-2xl border border-gray-200 hover:border-academy-blue hover:shadow-lg transition-all">
              <BookOpen className="w-7 h-7 text-academy-blue mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Formation IA</h3>
                <p className="text-sm text-gray-600">Intelligence artificielle</p>
              </div>
            </Link>
            <Link to="/programming-course" className="flex items-center p-6 bg-white rounded-2xl border border-gray-200 hover:border-academy-purple hover:shadow-lg transition-all">
              <Code className="w-7 h-7 text-academy-purple mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Formation Programmation</h3>
                <p className="text-sm text-gray-600">Développement web & mobile</p>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-academy-blue/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-academy-purple/10 rounded-full filter blur-xl"></div>
            <img 
              src="/lovable-uploads/5f417ca9-ec0a-42b3-9e82-56b7ec1866fe.png"
              alt="Équipe collaborant sur un projet de programmation IA" 
              className="relative z-10 rounded-lg shadow-xl w-full h-auto object-cover"
            />
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-academy-blue rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Centered benefits section */}
      <div className="container mx-auto px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Nos avantages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
              <span className="text-3xl mr-4">🎓</span>
              <span className="font-medium">Formation reconnue par l'État</span>
            </div>
            <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
              <span className="text-3xl mr-4">🌍</span>
              <span className="font-medium">Certification internationale</span>
            </div>
            <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
              <span className="text-3xl mr-4">💼</span>
              <span className="font-medium">Métiers tech rémunérateurs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Comparison Section */}
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

      {/* Career Paths Section */}
      <div className="container mx-auto px-6 py-16 bg-academy-gray/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-center">Opportunités de carrière</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-10">
            Nos formations vous préparent pour les métiers les plus demandés et les mieux rémunérés dans le secteur technologique.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Career Paths */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-academy-blue">Après la formation IA</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">🤖</span>
                  <div>
                    <h4 className="font-semibold">Data Scientist</h4>
                    <p className="text-sm text-gray-600">Analyser des données pour en extraire des insights précieux</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">🧠</span>
                  <div>
                    <h4 className="font-semibold">Ingénieur ML</h4>
                    <p className="text-sm text-gray-600">Créer et déployer des modèles d'apprentissage automatique</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">📊</span>
                  <div>
                    <h4 className="font-semibold">Consultant IA</h4>
                    <p className="text-sm text-gray-600">Conseiller les entreprises sur leurs stratégies d'IA</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Programming Career Paths */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-academy-purple">Après la formation Programmation</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">💻</span>
                  <div>
                    <h4 className="font-semibold">Développeur Full Stack</h4>
                    <p className="text-sm text-gray-600">Créer des applications web complètes de A à Z</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">📱</span>
                  <div>
                    <h4 className="font-semibold">Développeur Mobile</h4>
                    <p className="text-sm text-gray-600">Concevoir des applications iOS et Android performantes</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                  <span className="text-xl mr-3">🔄</span>
                  <div>
                    <h4 className="font-semibold">DevOps Engineer</h4>
                    <p className="text-sm text-gray-600">Automatiser et optimiser les déploiements d'applications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

