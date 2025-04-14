
import React from 'react';
import { Brain, Book, Monitor, Award, Clock, Network } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-10 h-10 text-academy-blue" />,
    title: "AI Fundamentals",
    description: "Learn the core concepts and mathematics behind machine learning and artificial intelligence."
  },
  {
    icon: <Monitor className="w-10 h-10 text-academy-blue" />,
    title: "Hands-On Projects",
    description: "Build real AI applications with guided projects that enhance your portfolio and skills."
  },
  {
    icon: <Award className="w-10 h-10 text-academy-blue" />,
    title: "Industry Certification",
    description: "Earn a recognized certification that validates your expertise to potential employers."
  },
  {
    icon: <Book className="w-10 h-10 text-academy-blue" />,
    title: "Comprehensive Curriculum",
    description: "Our curriculum covers everything from basic ML algorithms to advanced neural networks."
  },
  {
    icon: <Network className="w-10 h-10 text-academy-blue" />,
    title: "Networking Opportunities",
    description: "Connect with industry professionals and fellow students in our exclusive community."
  },
  {
    icon: <Clock className="w-10 h-10 text-academy-blue" />,
    title: "Flexible Learning",
    description: "Study at your own pace with lifetime access to course materials and regular updates."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our AI Technician Program</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our comprehensive program is designed to transform beginners into industry-ready AI specialists 
            through practical training and expert guidance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white p-6 rounded-lg border border-gray-200 hover:border-academy-blue transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
