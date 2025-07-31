import React from 'react';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';

const BlogHeroSection: React.FC = () => {
  const stats = [
    { icon: BookOpen, value: "+50", label: "Articles" },
    { icon: Users, value: "10K+", label: "Lecteurs" },
    { icon: Clock, value: "2x/semaine", label: "Nouveaux articles" },
    { icon: TrendingUp, value: "95%", label: "Satisfaction" }
  ];

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-academy-purple via-academy-blue to-academy-lightblue text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-academy-lightblue/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Blog Tech AVS Institute
          </h1>
          
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Découvrez les dernières tendances en Intelligence Artificielle, Programmation, 
            Cybersécurité et Marketing Digital. Des articles d'experts pour alimenter votre passion tech.
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHeroSection;