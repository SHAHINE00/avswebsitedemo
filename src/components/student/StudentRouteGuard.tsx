import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface StudentRouteGuardProps {
  children: React.ReactNode;
}

const StudentRouteGuard: React.FC<StudentRouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasStudent, setHasStudent] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      // Safety timeout: force stop checking after 5s
      const timeout = setTimeout(() => {
        console.warn('[StudentRouteGuard] Role check timeout after 5s');
        setChecking(false);
      }, 5000);

      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('[StudentRouteGuard] Error fetching roles:', error);
          setHasStudent(false);
          setHasAdmin(false);
        } else {
          const rolesList = roles?.map(r => r.role) || [];
          setHasStudent(rolesList.includes('student'));
          setHasAdmin(rolesList.includes('admin'));
          console.info('[StudentRouteGuard] Roles for user:', user.id, rolesList);
        }
      } catch (error) {
        console.error('[StudentRouteGuard] Exception checking roles:', error);
        setHasStudent(false);
        setHasAdmin(false);
      } finally {
        clearTimeout(timeout);
        setChecking(false);
      }
    };

    if (!loading) {
      checkRoles();
    }
  }, [user, loading]);

  if (loading || checking) {
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

  if (hasStudent) {
    return <>{children}</>;
  }

  if (hasAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-destructive">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cet espace étudiant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRouteGuard;
