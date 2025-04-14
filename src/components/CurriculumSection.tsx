
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const modules = [
  {
    title: "Module 1: Introduction to AI",
    description: "Understand the fundamental concepts, history, and applications of AI in modern technology.",
    topics: [
      "History and Evolution of AI",
      "Types of AI: Narrow vs. General AI",
      "Key AI Applications in Industry",
      "Ethical Considerations in AI Development"
    ]
  },
  {
    title: "Module 2: Machine Learning Fundamentals",
    description: "Master the core principles of machine learning algorithms and their practical applications.",
    topics: [
      "Supervised and Unsupervised Learning",
      "Regression and Classification",
      "Model Evaluation and Validation",
      "Feature Engineering and Selection"
    ]
  },
  {
    title: "Module 3: Deep Learning and Neural Networks",
    description: "Explore the architecture and applications of neural networks in solving complex problems.",
    topics: [
      "Neural Network Architecture",
      "Convolutional Neural Networks",
      "Recurrent Neural Networks",
      "Transfer Learning and Fine Tuning"
    ]
  },
  {
    title: "Module 4: AI System Implementation",
    description: "Learn to deploy, maintain and optimize AI systems in production environments.",
    topics: [
      "Model Deployment Best Practices",
      "Scaling and Performance Optimization",
      "Monitoring AI Systems",
      "Continuous Learning Systems"
    ]
  }
];

const CurriculumSection: React.FC = () => {
  return (
    <section id="curriculum" className="py-20 bg-academy-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive AI Curriculum</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our structured learning path takes you from AI fundamentals to advanced implementation,
            preparing you for real-world applications as an AI technician specialist.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
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
        
        <div className="mt-12 text-center">
          <Button className="bg-academy-blue hover:bg-academy-purple text-white font-semibold px-8 py-6 text-lg">
            View Full Curriculum
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
