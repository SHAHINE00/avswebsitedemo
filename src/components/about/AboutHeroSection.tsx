import React from 'react';

const AboutHeroSection: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            À propos d'AVS Innovation Institute
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Pionniers de l'innovation pédagogique en partenariat avec des universités et entreprises de renommée internationale, 
            nous formons les talents de demain aux technologies qui transforment le monde.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHeroSection;