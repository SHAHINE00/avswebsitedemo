
import { createContext, useContext } from 'react';
import { useSafeState, useSafeEffect, useSafeContext } from '@/utils/safeHooks';
import { logError, logWarn, logInfo, logDebug } from '@/utils/logger';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isProfessor: boolean;
  isStudent: boolean;
  adminLoading: boolean;
  professorProfile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useSafeContext(AuthContext);
  if (context === undefined || context === null) {
    // Return a safe fallback instead of throwing during HMR
    logWarn('useAuth called outside AuthProvider, returning fallback');
    return {
      user: null,
      session: null,
      isAdmin: false,
      isProfessor: false,
      isStudent: false,
      adminLoading: false,
      professorProfile: null,
      loading: false,
      signIn: async () => ({ error: new Error('Auth not available') }),
      signUp: async () => ({ error: new Error('Auth not available') }),
      signOut: async () => {}
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useSafeState<User | null>(null);
  const [session, setSession] = useSafeState<Session | null>(null);
  const [loading, setLoading] = useSafeState(true);
  const [isAdmin, setIsAdmin] = useSafeState(false);
  const [isProfessor, setIsProfessor] = useSafeState(false);
  const [isStudent, setIsStudent] = useSafeState(false);
  const [professorProfile, setProfessorProfile] = useSafeState<any | null>(null);
  const [adminLoading, setAdminLoading] = useSafeState(false);

  const checkRolesAndProfile = async (userId: string) => {
    setAdminLoading(true);
    try {
      // Get user roles first (fallback for admin detection)
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      const hasAdminRole = roles?.some(r => r.role === 'admin') || false;
      
      // Check admin role via RPC
      const { data: adminData, error: adminError } = await supabase.rpc('is_admin', {
        _user_id: userId
      });
      
      // Use RPC result if available, otherwise fallback to roles table
      if (!adminError && adminData !== null) {
        setIsAdmin(adminData === true);
      } else {
        setIsAdmin(hasAdminRole);
      }

      // Check professor role
      const { data: professorData, error: professorError } = await supabase.rpc('is_professor', {
        _user_id: userId
      });

      // DEBUG: Log professor check results
      console.log('🔍 Professor check result:', { 
        professorData, 
        professorError, 
        userId,
        timestamp: new Date().toISOString()
      });
      
      if (!professorError && professorData !== null) {
        setIsProfessor(professorData === true);
        
        // Fetch professor profile if they are a professor
        if (professorData === true) {
          const { data: profProfile } = await supabase
            .from('professors')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          setProfessorProfile(profProfile);
        }
      } else {
        setIsProfessor(false);
        setProfessorProfile(null);
      }

      console.log('📊 AuthContext roles snapshot:', { userId, roles });
      
      const hasStudentRole = roles?.some(r => r.role === 'student') || false;
      setIsStudent(hasStudentRole);

    } catch (error) {
      logError('Error checking roles:', error);
      setIsAdmin(false);
      setIsProfessor(false);
      setIsStudent(false);
      setProfessorProfile(null);
    } finally {
      setAdminLoading(false);
    }
  };

  useSafeEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check roles when user logs in
        if (session?.user) {
          checkRolesAndProfile(session.user.id);
        } else {
          setIsAdmin(false);
          setIsProfessor(false);
          setIsStudent(false);
          setProfessorProfile(null);
          setAdminLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check roles for existing session
      if (session?.user) {
        checkRolesAndProfile(session.user.id);
      }
    });

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          ...metadata,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== 'Invalid session') {
        logError('Logout error:', error);
      }
      // Clear local state regardless of API response
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsProfessor(false);
      setIsStudent(false);
      setProfessorProfile(null);
    } catch (error) {
      logError('Unexpected logout error:', error);
      // Force clear state on any error
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsProfessor(false);
      setIsStudent(false);
      setProfessorProfile(null);
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    isProfessor,
    isStudent,
    adminLoading,
    professorProfile,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
