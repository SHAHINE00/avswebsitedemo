import React from 'react';
import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfessorDashboard from '@/components/professor/ProfessorDashboard';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Professor: React.FC = () => {
  const { user, loading, isProfessor, adminLoading } = useAuth();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl px-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Note: Route is already protected by ProfessorRouteGuard. Avoid redundant redirects here.


  return (
    <ErrorBoundary>
      <SEOHead
        title="Tableau de bord Professeur | Nova Academy"
        description="Gérez vos cours, étudiants, présences et notes"
      />
      <div className="flex flex-col bg-background pt-16 sm:pt-20 lg:pt-24">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pb-24">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Tableau de bord Professeur</h1>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace professeur
            </p>
          </div>
          <ProfessorDashboard />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Professor;