import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ui/error-boundary';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  className = "min-h-screen bg-background"
}) => {
  return (
    <ErrorBoundary>
      <div className={`${className} flex flex-col`}>
        {showNavbar && <Navbar />}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default StandardPageLayout;