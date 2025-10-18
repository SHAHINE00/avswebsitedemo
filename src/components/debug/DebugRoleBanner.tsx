import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

/**
 * DebugRoleBanner - Development-only role display
 * Shows current user ID and roles for debugging
 * Only renders in development environment
 */
export const DebugRoleBanner: React.FC = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);

  // Only show in development
  if (import.meta.env.PROD) return null;
  if (!user) return null;

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      setRoles(data?.map(r => r.role) || []);
    };

    fetchRoles();
  }, [user.id]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
      <div className="text-xs font-mono space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">User ID:</span>
          <span className="font-semibold truncate">{user.id.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">Roles:</span>
          {roles.length > 0 ? (
            roles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No roles</span>
          )}
        </div>
      </div>
    </div>
  );
};
