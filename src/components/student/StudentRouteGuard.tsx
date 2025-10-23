import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface StudentRouteGuardProps {
  children: React.ReactNode;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ children }) => {
  const { user, loading, isStudent, isAdmin, adminLoading } = useAuth();

  // If user is already confirmed as student, show content immediately
  if (user && isStudent) {
    return <>{children}</>;
  }

  // Show loading only if initial auth is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Vérification des accès...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading for admin check only if we don't already know the role
  if (adminLoading && !isStudent && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Vérification des accès...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow admins with student role to access student section
  if (isAdmin && !isStudent) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-destructive">Accès refusé</h2>
          <p className="text-muted-foreground">
            Votre compte est connecté mais n'a pas encore de rôle étudiant. Si vous venez de vous inscrire, un administrateur doit approuver votre accès.
          </p>
          <Button asChild variant="outline">
            <Link to="/auth">Retour</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRouteGuard;
