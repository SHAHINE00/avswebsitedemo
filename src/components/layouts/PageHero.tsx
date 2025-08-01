import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  backgroundGradient?: string;
  textColor?: string;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  backgroundGradient = "from-academy-blue via-academy-purple to-academy-lightblue",
  textColor = "text-white",
  children
}) => {
  return (
    <div className={`pt-24 pb-16 bg-gradient-to-br ${backgroundGradient} ${textColor} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {Icon && (
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Icon className="w-12 h-12" />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          
          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 opacity-90">
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHero;