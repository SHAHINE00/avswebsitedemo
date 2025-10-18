import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * RoleRouter - Centralized role-based navigation
 * Redirects users to their appropriate dashboard based on their roles
 * Priority: admin -> /admin, professor -> /professor, student -> /dashboard
 */
export const RoleRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectByRole = async () => {
      // Don't redirect if still loading or no user
      if (loading || !user) return;

      // Only redirect from specific entry points to avoid loops
      const shouldRedirect = 
        location.pathname === '/auth' || 
        location.pathname === '/' ||
        location.pathname === '/dashboard';

      if (!shouldRedirect) return;

      try {
        // Fetch roles directly from user_roles table
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        console.log('🎯 RoleRouter redirect decision:', { userId: user.id, roles, currentPath: location.pathname });

        if (!roles || roles.length === 0) {
          // No roles assigned, send to default dashboard
          if (location.pathname !== '/dashboard') {
            navigate('/dashboard', { replace: true });
          }
          return;
        }

        // Priority-based routing
        const hasAdmin = roles.some(r => r.role === 'admin');
        const hasProfessor = roles.some(r => r.role === 'professor');

        if (hasAdmin && location.pathname !== '/admin') {
          navigate('/admin', { replace: true });
        } else if (hasProfessor && !hasAdmin && location.pathname !== '/professor') {
          navigate('/professor', { replace: true });
        } else if (!hasAdmin && !hasProfessor && location.pathname !== '/dashboard') {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('RoleRouter error:', error);
      }
    };

    redirectByRole();
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};
