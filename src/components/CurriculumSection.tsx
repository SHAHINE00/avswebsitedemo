
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, ArrowRight, Clock, Users, Award, Brain, Calculator, Database, Cloud, Gavel, Target } from 'lucide-react';

const CurriculumSection: React.FC = () => {
  const aiKeyAreas = [
    {
      icon: Brain,
      title: "AI Knowledge",
      description: "Careers, educational pathways, ethics, and governance in AI"
    },
    {
      icon: Calculator,
      title: "Mathematics & Statistics", 
      description: "Core math (linear algebra, calculus, probability) and statistical techniques for AI"
    },
    {
      icon: Code,
      title: "Programming & Algorithms",
      description: "Python programming, algorithms, and machine learning basics"
    },
    {
      icon: Database,
      title: "Data Management & Tools",
      description: "SQL, data preprocessing, and visualization with Python tools (Pandas, Matplotlib)"
    },
    {
      icon: Target,
      title: "Advanced AI Techniques",
      description: "Deep learning, NLP, and computer vision"
    },
    {
      icon: Cloud,
      title: "Cloud & Deployment",
      description: "Using cloud platforms (AWS, GCP, Azure) and deploying AI models"
    },
    {
      icon: BookOpen,
      title: "Practical Application",
      description: "Case studies, projects, and internships to gain hands-on experience"
    },
    {
      icon: Gavel,
      title: "Legal & Ethical Considerations",
      description: "Understanding AI's impact on law, ethics, and society"
    }
  ];

  return (
    <section id="curriculum" className="py-16 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Formations Professionnelles</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choisissez votre parcours et maîtrisez les technologies d'avenir. Nos programmes complets vous préparent aux métiers de demain avec une approche pratique et innovante.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formation IA */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="bg-gradient-to-r from-academy-blue to-academy-purple p-8 text-white">
              <div className="flex items-center mb-4">
                <BookOpen className="w-10 h-10 mr-4" />
                <h3 className="text-2xl font-bold">Formation IA</h3>
              </div>
              <p className="text-lg opacity-90">
                Intelligence Artificielle & Machine Learning
              </p>
            </div>
            
            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Plongez dans l'univers de l'intelligence artificielle et apprenez à créer des solutions innovantes. 
                Notre programme complet de 27 modules vous forme aux technologies IA les plus avancées.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-academy-blue mr-2" />
                  <span className="text-sm font-medium">18 mois</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-academy-blue mr-2" />
                  <span className="text-sm font-medium">27 modules</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-academy-blue mr-2" />
                  <span className="text-sm font-medium">Diplôme certifié</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-academy-blue mr-2" />
                  <span className="text-sm font-medium">Projets pratiques</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-gray-800">Domaines clés :</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {aiKeyAreas.map((area, index) => (
                    <div key={index} className="flex items-start">
                      <area.icon className="w-4 h-4 text-academy-blue mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800">{area.title}:</span>
                        <span className="text-gray-600 ml-1">{area.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button asChild className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3 rounded-xl group-hover:shadow-lg transition-all">
                <Link to="/ai-course">
                  Découvrir le programme complet
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Formation Programmation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="bg-gradient-to-r from-academy-purple to-academy-blue p-8 text-white">
              <div className="flex items-center mb-4">
                <Code className="w-10 h-10 mr-4" />
                <h3 className="text-2xl font-bold">Formation Programmation</h3>
              </div>
              <p className="text-lg opacity-90">
                Développement Web & Mobile Moderne
              </p>
            </div>
            
            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Maîtrisez les langages et technologies les plus demandés pour développer des applications 
                web et mobile modernes. Un parcours complet du développeur fullstack.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-academy-purple mr-2" />
                  <span className="text-sm font-medium">24 semaines</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-academy-purple mr-2" />
                  <span className="text-sm font-medium">4 modules</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-academy-purple mr-2" />
                  <span className="text-sm font-medium">Diplôme certifié</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-5 h-5 text-academy-purple mr-2" />
                  <span className="text-sm font-medium">Portfolio projets</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-800">Domaines clés :</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Développement web fullstack</li>
                  <li>• Applications mobiles iOS/Android</li>
                  <li>• Architectures logicielles modernes</li>
                  <li>• DevOps et déploiement cloud</li>
                </ul>
              </div>
              
              <Button asChild className="w-full bg-academy-purple hover:bg-academy-blue text-white font-semibold py-3 rounded-xl group-hover:shadow-lg transition-all">
                <Link to="/programming-course">
                  Découvrir le programme complet
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Prêt à transformer votre carrière ?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Rejoignez des centaines d'étudiants qui ont déjà choisi l'excellence. 
              Nos formations vous donnent les clés pour réussir dans les métiers technologiques d'avenir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-3">
                <Link to="/register">S'inscrire maintenant</Link>
              </Button>
              <Button asChild variant="outline" className="border-academy-blue text-academy-blue hover:bg-academy-blue/10 font-semibold px-8 py-3">
                <Link to="/contact">Demander des informations</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
