-- Fix appointments table RLS and add security enhancements

-- Update appointments table to make user_id NOT NULL (with default handling for existing records)
UPDATE public.appointments SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;

-- Add comprehensive RLS policies for appointments
DROP POLICY IF EXISTS "appointments_anon_no_access" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admins_all" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_update_own" ON public.appointments;

-- Strict anon denial for all operations
CREATE POLICY "appointments_deny_anon"
ON public.appointments
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Admins can access everything
CREATE POLICY "appointments_admin_full_access"
ON public.appointments
FOR ALL
TO authenticated
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());

-- Users can only access their own appointments
CREATE POLICY "appointments_user_own_only"
ON public.appointments
FOR ALL
TO authenticated
USING (auth.uid() = user_id OR check_admin_role_strict())
WITH CHECK (auth.uid() = user_id OR check_admin_role_strict());

-- Create security audit trigger for appointments
CREATE OR REPLACE FUNCTION audit_appointment_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    action,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP || '_appointment',
    jsonb_build_object(
      'appointment_id', COALESCE(NEW.id, OLD.id),
      'table', 'appointments'
    ),
    inet_client_addr()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger to appointments
DROP TRIGGER IF EXISTS audit_appointments_trigger ON public.appointments;
CREATE TRIGGER audit_appointments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION audit_appointment_access();

-- Create security monitoring function for rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_identifier text,
  p_action text,
  p_max_attempts integer DEFAULT 5,
  p_time_window_minutes integer DEFAULT 15
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  attempt_count integer;
  time_threshold timestamp;
BEGIN
  time_threshold := now() - (p_time_window_minutes || ' minutes')::interval;
  
  SELECT COUNT(*) INTO attempt_count
  FROM user_activity_logs
  WHERE (user_id::text = p_user_identifier OR ip_address::text = p_user_identifier)
    AND action = p_action
    AND created_at > time_threshold;
    
  RETURN attempt_count < p_max_attempts;
END;
$$;