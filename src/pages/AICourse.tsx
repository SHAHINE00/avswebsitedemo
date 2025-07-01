
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AICourse = () => {
  const modules = [
    {
      code: "M01",
      title: "MÉTIER ET FORMATION EN INTELLIGENCE ARTIFICIELLE",
      description: "Introduction to AI careers and educational pathways, exploring various job roles and skillsets in the AI field.",
      duration: "2 semaines"
    },
    {
      code: "M02", 
      title: "L'ENTREPRISE, ÉTHIQUE ET GOUVERNANCE EN IA",
      description: "Study of business practices, ethical concerns, and governance models in AI applications.",
      duration: "2 semaines"
    },
    {
      code: "M03",
      title: "MATHÉMATIQUES FONDAMENTALES POUR L'IA", 
      description: "Fundamental mathematical concepts for AI, including linear algebra, calculus, and probability theory.",
      duration: "4 semaines"
    },
    {
      code: "M04",
      title: "ALGORITHMIQUE ET PROGRAMMATION PYTHON POUR L'IA",
      description: "Introduction to algorithms and Python programming specifically tailored for AI applications.",
      duration: "4 semaines"
    },
    {
      code: "M05",
      title: "INTRODUCTION AUX BASES DE DONNÉES ET SQL",
      description: "Fundamentals of databases and SQL for data management in AI projects.",
      duration: "3 semaines"
    },
    {
      code: "M06",
      title: "STATISTIQUE DESCRIPTIVE ET INFÉRENTIELLE POUR L'IA",
      description: "Descriptive and inferential statistics applied to AI, helping in data analysis and interpretation.",
      duration: "3 semaines"
    },
    {
      code: "M07",
      title: "PRÉTRAITEMENT ET VISUALISATION DE DONNÉES",
      description: "Data preprocessing techniques and visualization tools (Python, Pandas, Matplotlib) to prepare data for analysis.",
      duration: "3 semaines"
    },
    {
      code: "M08",
      title: "INTRODUCTION AU MACHINE LEARNING",
      description: "An introduction to machine learning concepts, types, and evaluation techniques.",
      duration: "4 semaines"
    },
    {
      code: "M09",
      title: "OUTILS ET ENVIRONNEMENTS DE DÉVELOPPEMENT POUR L'IA",
      description: "Overview of development environments and tools like Git, Jupyter, and IDEs for AI development.",
      duration: "2 semaines"
    },
    {
      code: "M10",
      title: "COMMUNICATION PROFESSIONNELLE ET TECHNIQUE",
      description: "Developing communication skills for presenting technical and professional ideas in AI.",
      duration: "2 semaines"
    },
    {
      code: "M11",
      title: "ANGLAIS TECHNIQUE POUR L'IA",
      description: "Technical English skills specific to AI terminology and practices.",
      duration: "2 semaines"
    },
    {
      code: "M12",
      title: "VEILLE TECHNOLOGIQUE ET SCIENTIFIQUE EN IA",
      description: "Research techniques for staying updated with technological and scientific advancements in AI.",
      duration: "2 semaines"
    },
    {
      code: "M13",
      title: "GESTION DE PROJET AGILE APPLIQUÉE À L'IA",
      description: "Agile project management techniques applied to AI projects to ensure efficiency and flexibility.",
      duration: "3 semaines"
    },
    {
      code: "M14",
      title: "STAGE D'IMMERSION EN ENTREPRISE ET INITIATION AUX PRATIQUES PROFESSIONNELLES (STAGE I)",
      description: "Hands-on internship experience in a professional AI environment to apply learned concepts.",
      duration: "4 semaines"
    },
    {
      code: "M15",
      title: "TECHNIQUES AVANCÉES DE MACHINE LEARNING",
      description: "Advanced machine learning techniques such as regression, classification, and clustering.",
      duration: "4 semaines"
    },
    {
      code: "M16",
      title: "INTRODUCTION AU DEEP LEARNING ET RÉSEAUX DE NEURONES",
      description: "Introduction to deep learning and neural networks, including CNNs and RNNs.",
      duration: "4 semaines"
    },
    {
      code: "M17",
      title: "TRAITEMENT AUTOMATIQUE DU LANGAGE NATUREL (NLP)",
      description: "Fundamentals and applications of Natural Language Processing (NLP) in AI.",
      duration: "4 semaines"
    },
    {
      code: "M18",
      title: "VISION PAR ORDINATEUR (COMPUTER VISION)",
      description: "Study of computer vision technologies for analyzing visual data in AI systems.",
      duration: "4 semaines"
    },
    {
      code: "M19",
      title: "MANIPULATION DE DONNÉES AVANCÉE AVEC PANDAS ET NUMPY",
      description: "Advanced data manipulation techniques with Pandas and NumPy libraries.",
      duration: "3 semaines"
    },
    {
      code: "M20",
      title: "FRAMEWORKS DE MACHINE LEARNING",
      description: "Introduction to machine learning frameworks like Scikit-learn, TensorFlow, and Keras.",
      duration: "4 semaines"
    },
    {
      code: "M21",
      title: "INTRODUCTION AUX PLATEFORMES CLOUD POUR L'IA",
      description: "Overview of cloud platforms such as AWS SageMaker, Azure ML, and GCP AI for AI applications.",
      duration: "3 semaines"
    },
    {
      code: "M22",
      title: "PRINCIPES DE DÉPLOIEMENT DE MODÈLES IA",
      description: "Principles of deploying AI models, including containerization, APIs, and MLOps.",
      duration: "4 semaines"
    },
    {
      code: "M23",
      title: "QUALITÉ, TEST ET VALIDATION DES MODÈLES D'IA",
      description: "Techniques for testing, validating, and ensuring the quality of AI models.",
      duration: "3 semaines"
    },
    {
      code: "M24",
      title: "ÉTUDES DE CAS ET PROJETS PRATIQUES INTÉGRÉS EN IA",
      description: "Case studies and integrated practical projects to apply AI knowledge in real-world scenarios.",
      duration: "4 semaines"
    },
    {
      code: "M25",
      title: "DROIT, ÉTHIQUE, BIAIS ET RESPONSABILITÉ EN INTELLIGENCE ARTIFICIELLE",
      description: "Legal, ethical, and bias-related issues in AI, along with responsibility considerations.",
      duration: "3 semaines"
    },
    {
      code: "M26",
      title: "PRÉPARATION À L'INSERTION PROFESSIONNELLE ET RECHERCHE D'EMPLOI EN IA",
      description: "Career preparation and job search strategies for entering the AI field.",
      duration: "3 semaines"
    },
    {
      code: "M27",
      title: "PROJET DE FIN D'ÉTUDES EN INTELLIGENCE ARTIFICIELLE",
      description: "Capstone project where students apply all their AI knowledge in a final research or development project.",
      duration: "6 semaines"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formation Complète en Intelligence Artificielle</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Programme complet de 27 modules couvrant tous les aspects de l'intelligence artificielle, de l'initiation aux techniques avancées.
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Programme de la formation IA - 27 Modules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center mb-3">
                    <span className="bg-academy-blue text-white px-3 py-1 rounded text-sm font-semibold mr-3">
                      {module.code}
                    </span>
                    <span className="text-sm text-gray-600">{module.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-academy-blue leading-tight">{module.title}</h3>
                  <p className="text-gray-700 text-sm">{module.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-academy-gray rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Durée totale de la formation</h3>
              <p className="text-lg text-gray-700 mb-6">
                Formation intensive de 18 mois incluant stages pratiques et projet de fin d'études
              </p>
              <Button asChild className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
                <Link to="/register">
                  S'inscrire à la formation IA <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AICourse;
