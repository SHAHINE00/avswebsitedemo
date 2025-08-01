import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = "",
  containerClassName = "",
  background = 'white',
  padding = 'lg',
  id
}) => {
  const backgroundClasses = {
    white: 'bg-background',
    gray: 'bg-muted/30',
    gradient: 'bg-gradient-to-br from-background to-muted/50',
    transparent: 'bg-transparent'
  };

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };

  return (
    <section 
      id={id}
      className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}
    >
      <div className={`container mx-auto px-6 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;