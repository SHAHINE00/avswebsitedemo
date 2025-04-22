
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const instructors = [
  {
    name: "Dr. Sarah Johnson",
    title: "Chercheuse experte en IA",
    bio: "Ancienne responsable de recherche chez Google Brain avec plus de 15 ans d'expérience en deep learning et réseaux neuronaux.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    name: "Michael Chen",
    title: "Ingénieur Machine Learning",
    bio: "Responsable technique chez Amazon AWS, expert du déploiement d’IA à grande échelle et du cloud.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Amanda Patel",
    title: "Spécialiste Éthique IA",
    bio: "Autrice et consultante, spécialiste en IA responsable et problématiques d’automatisation.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
  },
  {
    name: "James Wilson",
    title: "Expert applications IA",
    bio: "Ancien CTO de startup IA, expérience multisectorielle : santé, finance, commerce.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  }
];

const InstructorsSection: React.FC = () => {
  return (
    <section id="instructors" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Apprenez auprès d’experts</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Nos formateurs cumulent des décennies d’expérience dans les entreprises et instituts de recherche leaders en IA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src={instructor.image} 
                  alt={instructor.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                <p className="text-academy-purple font-medium mb-3">{instructor.title}</p>
                <p className="text-gray-600 mb-4">{instructor.bio}</p>
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-500 hover:text-academy-blue transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-academy-blue transition-colors">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;
