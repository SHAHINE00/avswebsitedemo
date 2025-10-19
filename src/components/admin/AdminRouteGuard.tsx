import React from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useSafeState<boolean | null>(null);
  const [loading, setLoading] = useSafeState(true);

  useSafeEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        const hasAdmin = roles?.some(r => r.role === 'admin');
        
        if (hasAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          // Redirect students/professors immediately
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        setIsAdmin(false);
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  // Redirect to auth if not logged in
  useSafeEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking authentication and admin status
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return null; // Will redirect via useEffect
  }

  // User logged in but not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-3">
                <p className="font-medium">Accès Administrateur Requis</p>
                <p className="text-sm">
                  Cette section est réservée aux administrateurs. 
                  Contactez un administrateur si vous pensez avoir besoin d'un accès.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // User is admin - render children with admin badge
  return (
    <div className="min-h-screen">
      <div className="bg-green-50 border-b border-green-200 px-4 py-2">
        <div className="flex items-center justify-center text-sm text-green-800">
          <Shield className="h-4 w-4 mr-2" />
          Mode Administrateur - Accès privilégié actif
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminRouteGuard;