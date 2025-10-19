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

      // Block students from accessing admin/professor routes
      const isStudentBlockedRoute = 
        location.pathname.startsWith('/admin') || 
        location.pathname.startsWith('/professor');

      // Only redirect from specific entry points to avoid loops
      const shouldRedirect = 
        location.pathname === '/auth' || 
        location.pathname === '/' ||
        location.pathname === '/student' ||
        location.pathname === '/dashboard' ||
        isStudentBlockedRoute;

      if (!shouldRedirect) return;

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

        // Priority-based routing - compute student explicitly
        const hasAdmin = roles.some(r => r.role === 'admin');
        const hasProfessor = roles.some(r => r.role === 'professor');
        const hasStudent = roles.some(r => r.role === 'student');

        // Block students from admin/professor routes (only if not admin/professor)
        if (hasStudent && !hasAdmin && !hasProfessor && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/professor'))) {
          console.log('🚫 Student blocked from accessing protected route, redirecting to /student');
          navigate('/student', { replace: true });
          return;
        }

        // Priority-based routing for entry points
        if (hasAdmin && location.pathname !== '/admin' && !location.pathname.startsWith('/admin/')) {
          navigate('/admin', { replace: true });
        } else if (hasProfessor && !hasAdmin && location.pathname !== '/professor' && !location.pathname.startsWith('/professor/')) {
          navigate('/professor', { replace: true });
        } else if (hasStudent && !hasAdmin && !hasProfessor && location.pathname !== '/student' && location.pathname !== '/dashboard') {
          navigate('/student', { replace: true });
        }
      } catch (error) {
        console.error('RoleRouter error:', error);
      }
    };

    redirectByRole();
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
};
