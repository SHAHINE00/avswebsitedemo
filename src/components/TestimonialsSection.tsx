import React from 'react';
import { Star, Quote } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const testimonials = [
  {
    name: "Youssef El Mansouri",
    title: "Développeur AI",
    testimonial: "Cette formation a transformé ma carrière. Je suis passé de débutant à la mise en œuvre de systèmes AI complexes en 6 mois. Les projets pratiques ont vraiment consolidé mes acquis !",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 5
  },
  {
    name: "Khadija Benali",
    title: "Data Scientist",
    testimonial: "Le cursus m'a apporté théorie et compétences pratiques pour mon travail. Les formateurs sont de vrais experts et le contenu est constamment à jour.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 5
  },
  {
    name: "Omar Lamrini",
    title: "Entrepreneur Tech",
    testimonial: "Pour intégrer l'AI à ma startup, ce programme était idéal. La partie sur le déploiement AI a été particulièrement précieuse.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text">Ils témoignent</h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Découvrez les retours de nos diplômés qui ont propulsé leur carrière grâce à notre programme AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-academy-gray rounded-lg p-4 sm:p-6 relative">
              <div className="absolute -top-3 -left-3 text-academy-purple opacity-20">
                <Quote size={40} />
              </div>
              <div className="mb-4 flex">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i + testimonial.rating} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 relative z-10">"{testimonial.testimonial}"</p>
              <div className="flex items-center">
                <OptimizedImage
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  sizes="48px"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
