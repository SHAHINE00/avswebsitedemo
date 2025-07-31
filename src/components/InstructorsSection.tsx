
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import instructorMale1 from '@/assets/instructor-male-1.jpg';
import instructorMale2 from '@/assets/instructor-male-2.jpg';
import instructorFemale1 from '@/assets/instructor-female-1.jpg';
import instructorFemale2 from '@/assets/instructor-female-2.jpg';
import instructorMoroccanFemale from '@/assets/instructor-moroccan-female.jpg';

const instructors = [
  {
    name: "Dr. Youssef Bennani",
    title: "Chercheur expert en IA",
    bio: "Ancien responsable de recherche chez Google Brain avec plus de 15 ans d'expérience en deep learning et réseaux neuronaux.",
    image: instructorMale1
  },
  {
    name: "Fatima Zahra Alami",
    title: "Ingénieure Machine Learning",
    bio: "Responsable technique chez Amazon AWS, experte du déploiement d'IA à grande échelle et du cloud.",
    image: instructorMoroccanFemale
  },
  {
    name: "Dr. Hassan Cherkaoui",
    title: "Spécialiste Éthique IA",
    bio: "Auteur et consultant, spécialiste en IA responsable et problématiques d'automatisation.",
    image: instructorMale2
  },
  {
    name: "Aicha Bourhim",
    title: "Experte applications IA",
    bio: "Ancienne CTO de startup IA, expérience multisectorielle : santé, finance, commerce.",
    image: instructorFemale2
  }
];

const InstructorsSection: React.FC = () => {
  return (
    <section id="instructors" className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Apprenez auprès d'experts</h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Nos formateurs cumulent des décennies d'expérience dans les entreprises et instituts de recherche leaders en AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {instructors.map((instructor, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-48 sm:h-64 overflow-hidden">
                <OptimizedImage
                  src={instructor.image} 
                  alt={instructor.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
