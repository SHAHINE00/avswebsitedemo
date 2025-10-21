import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProfessorRouteGuardProps {
  children: React.ReactNode;
}

const ProfessorRouteGuard: React.FC<ProfessorRouteGuardProps> = ({ children }) => {
  const { user, loading: authLoading, isProfessor, adminLoading } = useAuth();

  // Show loading while checking authentication and roles
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if not a professor
  if (!isProfessor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">Accès refusé</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vous devez avoir le rôle de professeur pour accéder à cette section.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProfessorRouteGuard;