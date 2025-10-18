import React from 'react';
import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfessorDashboard from '@/components/professor/ProfessorDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Professor: React.FC = () => {
  const { user, loading, isProfessor } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isProfessor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEOHead
        title="Tableau de bord Professeur | Nova Academy"
        description="Gérez vos cours, étudiants, présences et notes"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
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
    </>
  );
};

export default Professor;