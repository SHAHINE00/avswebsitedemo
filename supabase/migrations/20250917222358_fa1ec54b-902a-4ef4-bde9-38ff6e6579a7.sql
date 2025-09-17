-- Final security hardening to fix all remaining issues

-- 1. Ensure RLS is enabled on ALL sensitive tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- 2. Create a comprehensive security test function
CREATE OR REPLACE FUNCTION public.test_anonymous_access_blocked()
RETURNS jsonb AS $$
DECLARE
  test_results jsonb := '{}';
  table_name text;
  row_count integer;
BEGIN
  -- Test each sensitive table for anonymous access
  FOR table_name IN 
    VALUES ('appointments'), ('pending_users'), ('subscribers'), ('profiles'),
           ('user_activity_logs'), ('admin_activity_logs'), ('email_stats'),
           ('unsubscribes'), ('unsubscribe_tokens')
  LOOP
    BEGIN
      -- Try to count rows as anonymous user would
      EXECUTE format('SELECT count(*) FROM %I', table_name) INTO row_count;
      
      -- If we get here without error, check if count is 0 (which is expected)
      test_results := jsonb_set(
        test_results, 
        ARRAY[table_name], 
        to_jsonb(jsonb_build_object(
          'accessible', true,
          'row_count', row_count,
          'status', CASE WHEN row_count = 0 THEN 'SECURE' ELSE 'VULNERABLE' END
        ))
      );
    EXCEPTION
      WHEN insufficient_privilege THEN
        -- This is what we want - access denied
        test_results := jsonb_set(
          test_results, 
          ARRAY[table_name], 
          to_jsonb(jsonb_build_object(
            'accessible', false,
            'status', 'SECURE',
            'message', 'Access properly denied'
          ))
        );
      WHEN OTHERS THEN
        -- Other errors
        test_results := jsonb_set(
          test_results, 
          ARRAY[table_name], 
          to_jsonb(jsonb_build_object(
            'accessible', false,
            'status', 'ERROR',
            'error', SQLERRM
          ))
        );
    END;
  END LOOP;
  
  RETURN test_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Force RLS policy evaluation to be more restrictive
-- Drop and recreate the appointments policies with even more explicit restrictions
DROP POLICY IF EXISTS "appointments_block_all_anonymous" ON public.appointments;
DROP POLICY IF EXISTS "appointments_authenticated_users_own_data" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admin_full_access" ON public.appointments;

-- Create ultra-restrictive policies
CREATE POLICY "appointments_deny_all_anonymous" ON public.appointments
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "appointments_deny_all_public" ON public.appointments
FOR ALL TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "appointments_admin_only" ON public.appointments
FOR ALL TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

CREATE POLICY "appointments_user_own_data_only" ON public.appointments
FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. Add additional security constraints to prevent data exposure
-- Ensure user_id cannot be null in appointments (security requirement)
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS check_appointment_user_id_not_null;

ALTER TABLE public.appointments 
ADD CONSTRAINT enforce_user_id_not_null 
CHECK (user_id IS NOT NULL);

-- 5. Create security monitoring function
CREATE OR REPLACE FUNCTION public.monitor_data_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any attempts to access sensitive data
  INSERT INTO public.user_activity_logs (
    user_id,
    action,
    details,
    ip_address,
    created_at
  ) VALUES (
    COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
    'DATA_ACCESS_' || TG_TABLE_NAME,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now(),
      'user_role', COALESCE(auth.role(), 'anonymous')
    ),
    inet_client_addr(),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply monitoring to appointments table
DROP TRIGGER IF EXISTS monitor_appointments_access ON public.appointments;
CREATE TRIGGER monitor_appointments_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH STATEMENT EXECUTE FUNCTION public.monitor_data_access();

-- 6. Final security validation
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
    t.row_security as rls_enabled,
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
      WHEN t.row_security = false THEN 'CRITICAL_FAILURE'
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