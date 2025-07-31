import React from 'react';
import { GraduationCap, Award, Globe, Users, BookOpen, Trophy } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="w-12 h-12 text-academy-blue" />,
    title: "Formations Diversifiées",
    description: "Intelligence Artificielle, Programmation, Cybersécurité et bien plus. Des programmes adaptés aux besoins du marché."
  },
  {
    icon: <Award className="w-12 h-12 text-academy-blue" />,
    title: "Certifications Nationales",
    description: "Diplômes reconnus par l'État marocain et certifications professionnelles validées par l'industrie."
  },
  {
    icon: <Globe className="w-12 h-12 text-academy-blue" />,
    title: "Reconnaissance Internationale",
    description: "Partenariats avec des institutions internationales pour des certifications reconnues mondialement."
  },
  {
    icon: <GraduationCap className="w-12 h-12 text-academy-blue" />,
    title: "Excellence Académique",
    description: "15 ans d'expérience dans la formation professionnelle avec un taux de réussite de 95%."
  },
  {
    icon: <Users className="w-12 h-12 text-academy-blue" />,
    title: "Formateurs Experts",
    description: "Équipe pédagogique composée de professionnels actifs et de docteurs reconnus dans leurs domaines."
  },
  {
    icon: <Trophy className="w-12 h-12 text-academy-blue" />,
    title: "Insertion Professionnelle",
    description: "85% de nos diplômés trouvent un emploi dans les 6 mois grâce à notre réseau d'entreprises partenaires."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-academy-blue/10 rounded-full mb-6">
            <GraduationCap className="w-8 h-8 text-academy-blue" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
            Pourquoi choisir AVS Innovation Institute ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Leader de la formation professionnelle au Maroc, nous formons les talents de demain avec des programmes innovants, 
            des certifications reconnues et un accompagnement personnalisé vers l'excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-academy-blue/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 group-hover:text-academy-blue transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
