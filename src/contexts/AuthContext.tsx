
import React, { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import SafeComponentWrapper from '@/components/ui/SafeComponentWrapper';
import { useSafeState, useSafeEffect, useSafeContext } from '@/hooks/useSafeHooks';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, metadata?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useSafeContext(AuthContext);
  if (context === undefined || context === null) {
    console.warn('useAuth called outside AuthProvider or React not ready');
    return {
      user: null,
      session: null,
      loading: false,
      signIn: async () => ({ error: 'Auth not available' }),
      signUp: async () => ({ error: 'Auth not available' }),
      signOut: async () => {}
    };
  }
  return context;
};

const AuthProviderCore: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useSafeState<User | null>(null);
  const [session, setSession] = useSafeState<Session | null>(null);
  const [loading, setLoading] = useSafeState(true);

  useSafeEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeComponentWrapper 
      componentName="AuthProvider"
      fallback={<div>Loading authentication...</div>}
    >
      <AuthProviderCore>{children}</AuthProviderCore>
    </SafeComponentWrapper>
  );
};
