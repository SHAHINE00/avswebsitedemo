-- Fix critical security issues identified in security review

-- 1. Fix appointments table RLS policies (critical issue)
DROP POLICY IF EXISTS "appointments_deny_anonymous" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_user_own_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admin_full_access" ON public.appointments;

-- Create strict RLS policies for appointments
CREATE POLICY "appointments_block_all_anonymous" ON public.appointments
FOR ALL TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "appointments_authenticated_users_own_data" ON public.appointments
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "appointments_admin_full_access" ON public.appointments
FOR ALL TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

-- 2. Harden other sensitive tables with explicit anonymous blocking
DROP POLICY IF EXISTS "profiles_deny_anonymous" ON public.profiles;
CREATE POLICY "profiles_block_all_anonymous" ON public.profiles
FOR ALL TO anon
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "subscribers_deny_anonymous" ON public.subscribers;
CREATE POLICY "subscribers_block_all_anonymous" ON public.subscribers
FOR ALL TO anon
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "pending_users_deny_anonymous" ON public.pending_users;
CREATE POLICY "pending_users_block_all_anonymous" ON public.pending_users
FOR ALL TO anon
USING (false)
WITH CHECK (false);

-- 3. Add additional security constraints
ALTER TABLE public.appointments 
ADD CONSTRAINT check_appointment_user_id_not_null 
CHECK (user_id IS NOT NULL);

ALTER TABLE public.profiles 
ADD CONSTRAINT check_profile_id_not_null 
CHECK (id IS NOT NULL);

-- 4. Create security monitoring trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_table_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive tables for security monitoring
  INSERT INTO public.user_activity_logs (
    user_id, 
    action, 
    details, 
    ip_address,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record_id', COALESCE(NEW.id, OLD.id)
    ),
    inet_client_addr(),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for sensitive tables
CREATE TRIGGER log_appointments_access
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

CREATE TRIGGER log_profiles_access
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

-- 5. Update security validation function
CREATE OR REPLACE FUNCTION public.validate_comprehensive_security()
RETURNS TABLE(
  security_level text,
  table_name text,
  issue_type text,
  severity text,
  recommendation text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN t.row_security = false THEN 'CRITICAL'
      WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.tablename 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'HIGH'
      ELSE 'SECURE'
    END as security_level,
    t.tablename::text as table_name,
    CASE 
      WHEN t.row_security = false THEN 'RLS_DISABLED'
      WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.tablename 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'ANONYMOUS_ACCESS_ALLOWED'
      ELSE 'SECURE'
    END as issue_type,
    CASE 
      WHEN t.row_security = false THEN 'CRITICAL'
      WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.tablename 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'HIGH'
      ELSE 'LOW'
    END as severity,
    CASE 
      WHEN t.row_security = false THEN 'Enable RLS immediately'
      WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.tablename 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'Add explicit anonymous denial policy'
      ELSE 'No action required'
    END as recommendation
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  AND t.tablename IN (
    'appointments', 'pending_users', 'subscribers', 'profiles',
    'user_activity_logs', 'admin_activity_logs', 'email_stats',
    'unsubscribes', 'unsubscribe_tokens', 'courses', 'course_enrollments'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;