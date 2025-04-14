
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "David Miller",
    title: "AI Developer at Microsoft",
    testimonial: "This course was a game-changer for my career. I went from knowing basic programming to implementing complex AI systems in just 6 months. The hands-on projects really helped solidify my understanding.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    rating: 5
  },
  {
    name: "Jessica Zhang",
    title: "Data Scientist at Netflix",
    testimonial: "The AI Technician program provided me with both theoretical knowledge and practical skills that I use daily in my job. The instructors are true experts and the curriculum is constantly updated with the latest advancements.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    title: "Startup Founder",
    testimonial: "As someone looking to incorporate AI into my startup, this program gave me the exact skills I needed. The section on AI system implementation was particularly valuable for my business needs.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Graduates Say</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hear from our successful graduates who have transformed their careers
            with our AI Technician Specialist program.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-academy-gray rounded-lg p-6 relative">
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
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
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
