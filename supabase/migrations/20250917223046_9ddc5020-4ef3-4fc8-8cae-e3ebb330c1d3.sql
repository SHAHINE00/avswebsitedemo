-- Final comprehensive security lockdown

-- 1. Fix the security check function with correct column name
CREATE OR REPLACE FUNCTION public.final_security_check()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  anonymous_blocked boolean,
  admin_access boolean,
  security_score text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text,
    t.rowsecurity as rls_enabled,
    EXISTS (
      SELECT 1 FROM pg_policies p 
      WHERE p.schemaname = 'public' 
      AND p.tablename = t.tablename 
      AND p.roles = '{anon}' 
      AND p.qual = 'false'
    ) as anonymous_blocked,
    EXISTS (
      SELECT 1 FROM pg_policies p 
      WHERE p.schemaname = 'public' 
      AND p.tablename = t.tablename 
      AND p.qual LIKE '%check_admin_role%'
    ) as admin_access,
    CASE 
      WHEN t.rowsecurity = false THEN 'CRITICAL_FAILURE'
      WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.tablename 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'HIGH_RISK'
      ELSE 'SECURE'
    END as security_score
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  AND t.tablename IN (
    'appointments', 'pending_users', 'subscribers', 'profiles',
    'user_activity_logs', 'admin_activity_logs', 'email_stats',
    'unsubscribes', 'unsubscribe_tokens'
  )
  ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Force complete lockdown of all sensitive tables with aggressive policies
-- Drop ALL existing policies and recreate with absolute restriction

-- APPOINTMENTS - Complete lockdown
DROP POLICY IF EXISTS "appointments_deny_all_anonymous" ON public.appointments;
DROP POLICY IF EXISTS "appointments_deny_all_public" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admin_only" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_data_only" ON public.appointments;

-- Create absolute denial policies
CREATE POLICY "appointments_absolute_anon_denial" ON public.appointments
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "appointments_public_role_denial" ON public.appointments
FOR ALL TO public
USING (false)
WITH CHECK (false);

-- Only authenticated users with proper checks
CREATE POLICY "appointments_admin_access" ON public.appointments
FOR ALL TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

CREATE POLICY "appointments_user_access" ON public.appointments
FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id AND user_id IS NOT NULL);

-- SUBSCRIBERS - Complete lockdown
DROP POLICY IF EXISTS "subscribers_block_all_anonymous" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_admin_only" ON public.subscribers;

CREATE POLICY "subscribers_absolute_anon_denial" ON public.subscribers
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "subscribers_public_role_denial" ON public.subscribers
FOR ALL TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "subscribers_admin_access_only" ON public.subscribers
FOR ALL TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

-- PENDING_USERS - Complete lockdown
DROP POLICY IF EXISTS "pending_users_block_all_anonymous" ON public.pending_users;
DROP POLICY IF EXISTS "pending_users_deny_regular_users" ON public.pending_users;

CREATE POLICY "pending_users_absolute_anon_denial" ON public.pending_users
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "pending_users_public_role_denial" ON public.pending_users
FOR ALL TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "pending_users_admin_access_only" ON public.pending_users
FOR ALL TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

-- 3. Add additional security measures

-- Create function to ensure no data leakage
CREATE OR REPLACE FUNCTION public.block_all_public_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any unauthorized access attempts
  INSERT INTO public.user_activity_logs (
    user_id,
    action,
    details,
    created_at
  ) VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
    'UNAUTHORIZED_ACCESS_ATTEMPT',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'timestamp', now(),
      'blocked', true
    ),
    now()
  );
  
  -- Block the operation
  RAISE EXCEPTION 'Access denied - table % is protected', TG_TABLE_NAME;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Verify RLS is enabled on all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;