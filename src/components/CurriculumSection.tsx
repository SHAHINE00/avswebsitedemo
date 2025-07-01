
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, Code } from 'lucide-react';

const aiModules = [
  {
    code: "M01",
    title: "MÉTIER ET FORMATION EN INTELLIGENCE ARTIFICIELLE",
    description: "Introduction to AI careers and educational pathways, exploring various job roles and skillsets in the AI field."
  },
  {
    code: "M02", 
    title: "L'ENTREPRISE, ÉTHIQUE ET GOUVERNANCE EN IA",
    description: "Study of business practices, ethical concerns, and governance models in AI applications."
  },
  {
    code: "M03",
    title: "MATHÉMATIQUES FONDAMENTALES POUR L'IA", 
    description: "Fundamental mathematical concepts for AI, including linear algebra, calculus, and probability theory."
  },
  {
    code: "M04",
    title: "ALGORITHMIQUE ET PROGRAMMATION PYTHON POUR L'IA",
    description: "Introduction to algorithms and Python programming specifically tailored for AI applications."
  },
  {
    code: "M05",
    title: "INTRODUCTION AUX BASES DE DONNÉES ET SQL",
    description: "Fundamentals of databases and SQL for data management in AI projects."
  },
  {
    code: "M06",
    title: "STATISTIQUE DESCRIPTIVE ET INFÉRENTIELLE POUR L'IA",
    description: "Descriptive and inferential statistics applied to AI, helping in data analysis and interpretation."
  },
  {
    code: "M07",
    title: "PRÉTRAITEMENT ET VISUALISATION DE DONNÉES",
    description: "Data preprocessing techniques and visualization tools (Python, Pandas, Matplotlib) to prepare data for analysis."
  },
  {
    code: "M08",
    title: "INTRODUCTION AU MACHINE LEARNING",
    description: "An introduction to machine learning concepts, types, and evaluation techniques."
  },
  {
    code: "M09",
    title: "OUTILS ET ENVIRONNEMENTS DE DÉVELOPPEMENT POUR L'IA",
    description: "Overview of development environments and tools like Git, Jupyter, and IDEs for AI development."
  },
  {
    code: "M10",
    title: "COMMUNICATION PROFESSIONNELLE ET TECHNIQUE",
    description: "Developing communication skills for presenting technical and professional ideas in AI."
  },
  {
    code: "M11",
    title: "ANGLAIS TECHNIQUE POUR L'IA",
    description: "Technical English skills specific to AI terminology and practices."
  },
  {
    code: "M12",
    title: "VEILLE TECHNOLOGIQUE ET SCIENTIFIQUE EN IA",
    description: "Research techniques for staying updated with technological and scientific advancements in AI."
  },
  {
    code: "M13",
    title: "GESTION DE PROJET AGILE APPLIQUÉE À L'IA",
    description: "Agile project management techniques applied to AI projects to ensure efficiency and flexibility."
  },
  {
    code: "M14",
    title: "STAGE D'IMMERSION EN ENTREPRISE ET INITIATION AUX PRATIQUES PROFESSIONNELLES (STAGE I)",
    description: "Hands-on internship experience in a professional AI environment to apply learned concepts."
  },
  {
    code: "M15",
    title: "TECHNIQUES AVANCÉES DE MACHINE LEARNING",
    description: "Advanced machine learning techniques such as regression, classification, and clustering."
  },
  {
    code: "M16",
    title: "INTRODUCTION AU DEEP LEARNING ET RÉSEAUX DE NEURONES",
    description: "Introduction to deep learning and neural networks, including CNNs and RNNs."
  },
  {
    code: "M17",
    title: "TRAITEMENT AUTOMATIQUE DU LANGAGE NATUREL (NLP)",
    description: "Fundamentals and applications of Natural Language Processing (NLP) in AI."
  },
  {
    code: "M18",
    title: "VISION PAR ORDINATEUR (COMPUTER VISION)",
    description: "Study of computer vision technologies for analyzing visual data in AI systems."
  },
  {
    code: "M19",
    title: "MANIPULATION DE DONNÉES AVANCÉE AVEC PANDAS ET NUMPY",
    description: "Advanced data manipulation techniques with Pandas and NumPy libraries."
  },
  {
    code: "M20",
    title: "FRAMEWORKS DE MACHINE LEARNING",
    description: "Introduction to machine learning frameworks like Scikit-learn, TensorFlow, and Keras."
  },
  {
    code: "M21",
    title: "INTRODUCTION AUX PLATEFORMES CLOUD POUR L'IA",
    description: "Overview of cloud platforms such as AWS SageMaker, Azure ML, and GCP AI for AI applications."
  },
  {
    code: "M22",
    title: "PRINCIPES DE DÉPLOIEMENT DE MODÈLES IA",
    description: "Principles of deploying AI models, including containerization, APIs, and MLOps."
  },
  {
    code: "M23",
    title: "QUALITÉ, TEST ET VALIDATION DES MODÈLES D'IA",
    description: "Techniques for testing, validating, and ensuring the quality of AI models."
  },
  {
    code: "M24",
    title: "ÉTUDES DE CAS ET PROJETS PRATIQUES INTÉGRÉS EN IA",
    description: "Case studies and integrated practical projects to apply AI knowledge in real-world scenarios."
  },
  {
    code: "M25",
    title: "DROIT, ÉTHIQUE, BIAIS ET RESPONSABILITÉ EN INTELLIGENCE ARTIFICIELLE",
    description: "Legal, ethical, and bias-related issues in AI, along with responsibility considerations."
  },
  {
    code: "M26",
    title: "PRÉPARATION À L'INSERTION PROFESSIONNELLE ET RECHERCHE D'EMPLOI EN IA",
    description: "Career preparation and job search strategies for entering the AI field."
  },
  {
    code: "M27",
    title: "PROJET DE FIN D'ÉTUDES EN INTELLIGENCE ARTIFICIELLE",
    description: "Capstone project where students apply all their AI knowledge in a final research or development project."
  }
];

const programmingModules = [
  {
    title: "Module 1 : Fondamentaux de la programmation",
    description: "Acquérez les bases solides de la logique de programmation et des structures de données.",
    topics: [
      "Algorithmes et logique",
      "Structures de données fondamentales",
      "Paradigmes de programmation",
      "Tests et débogage"
    ]
  },
  {
    title: "Module 2 : Développement web moderne",
    description: "Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.",
    topics: [
      "HTML, CSS et JavaScript avancé",
      "Frameworks front-end (React, Vue)",
      "Architecture back-end et APIs",
      "Bases de données relationnelles et NoSQL"
    ]
  },
  {
    title: "Module 3 : Programmation orientée objet",
    description: "Approfondissez vos connaissances avec les principes de conception logicielle robustes.",
    topics: [
      "Classes, objets et héritage",
      "Principes SOLID",
      "Design patterns",
      "Architecture logicielle"
    ]
  },
  {
    title: "Module 4 : DevOps et déploiement",
    description: "Découvrez le cycle complet de livraison logicielle et les pratiques modernes.",
    topics: [
      "Intégration et déploiement continus",
      "Conteneurisation avec Docker",
      "Orchestration avec Kubernetes",
      "Monitoring et logging"
    ]
  }
];

const CurriculumSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ai");
  
  return (
    <section id="curriculum" className="py-12 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Parcours pédagogiques complets</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Des chemins structurés : de l'initiation jusqu'à la maîtrise pratique, pour faire de vous un expert dans votre domaine.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 text-lg font-semibold ${
              activeTab === "ai" 
                ? "bg-gradient-to-r from-academy-blue to-academy-purple text-white border-transparent shadow-lg" 
                : "border-academy-blue text-academy-blue hover:bg-academy-blue/10"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Formation IA
          </button>
          
          <button 
            onClick={() => setActiveTab("programming")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 text-lg font-semibold ${
              activeTab === "programming" 
                ? "bg-gradient-to-r from-academy-purple to-academy-blue text-white border-transparent shadow-lg" 
                : "border-academy-purple text-academy-purple hover:bg-academy-purple/10"
            }`}
          >
            <Code className="w-5 h-5" />
            Formation Programmation
          </button>
        </div>
        
        <div className="mt-8">
          {activeTab === "ai" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiModules.map((module, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start mb-3">
                      <span className="bg-academy-blue text-white px-2 py-1 rounded text-sm font-semibold mr-3 mt-1">
                        {module.code}
                      </span>
                      <h3 className="text-lg font-bold text-academy-blue leading-tight">{module.title}</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{module.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                  <Link to="/ai-course">Voir le programme IA complet</Link>
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "programming" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {programmingModules.map((module, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold mb-3 text-academy-blue">{module.title}</h3>
                    <p className="text-gray-700 mb-4">{module.description}</p>
                    <ul className="space-y-2 mb-5">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-academy-purple shrink-0 mr-2 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                  <Link to="/programming-course">Voir le programme Programmation complet</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
