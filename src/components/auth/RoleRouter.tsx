import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * RoleRouter - Centralized role-based navigation
 * Redirects users to their appropriate dashboard based on their roles
 * Priority: admin -> /admin, professor -> /professor, student -> /student
 */
export const RoleRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectByRole = async () => {
      // Don't redirect if still loading or no user
      if (loading || !user) return;

      // Check if user is on an entry point that needs role-based redirect
      const isEntryPoint = 
        location.pathname === '/auth' || 
        location.pathname === '/' ||
        location.pathname === '/dashboard';

      // We'll check after fetching roles if user should be redirected

      try {
        // Fetch roles directly from user_roles table
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        console.log('🎯 RoleRouter redirect decision:', { userId: user.id, roles, currentPath: location.pathname });

        if (!roles || roles.length === 0) {
          // No roles assigned, stay at /auth - don't grant access
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
          return;
        }

        // Compute roles explicitly
        const hasAdmin = roles.some(r => r.role === 'admin');
        const hasProfessor = roles.some(r => r.role === 'professor');
        const hasStudent = roles.some(r => r.role === 'student');

        // If user is already on a valid route for one of their roles, let them stay
        const isOnValidRoute = 
          (hasStudent && location.pathname.startsWith('/student')) ||
          (hasProfessor && location.pathname.startsWith('/professor')) ||
          (hasAdmin && location.pathname.startsWith('/admin'));

        if (isOnValidRoute) {
          console.log('✅ User is on valid route for their role, staying put');
          return; // Don't redirect, user is where they want to be
        }

        // Block students from accessing admin/professor routes (only if not admin/professor)
        if (hasStudent && !hasAdmin && !hasProfessor && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/professor'))) {
          console.log('🚫 Student blocked from accessing protected route, redirecting to /student');
          navigate('/student', { replace: true });
          return;
        }

        // Priority-based routing only from entry points
        if (isEntryPoint) {
          if (hasAdmin) {
            navigate('/admin', { replace: true });
          } else if (hasProfessor) {
            navigate('/professor', { replace: true });
          } else if (hasStudent) {
            navigate('/student', { replace: true });
          }
        }
      } catch (error) {
        console.error('RoleRouter error:', error);
      }
    };

    redirectByRole();
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};
