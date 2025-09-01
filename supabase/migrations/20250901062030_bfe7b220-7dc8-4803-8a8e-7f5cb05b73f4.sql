-- Fix security issues: Strengthen RLS policies for sensitive data

-- 1. Add explicit policy to prevent public access to appointments
DROP POLICY IF EXISTS "Public cannot access appointments" ON public.appointments;
CREATE POLICY "Public cannot access appointments" 
ON public.appointments 
FOR ALL 
TO anon 
USING (false);

-- 2. Add explicit policy to prevent public access to subscribers  
DROP POLICY IF EXISTS "Public cannot access subscribers" ON public.subscribers;
CREATE POLICY "Public cannot access subscribers" 
ON public.subscribers 
FOR ALL 
TO anon 
USING (false);

-- 3. Add explicit policy to prevent public access to email_stats
DROP POLICY IF EXISTS "Public cannot access email stats" ON public.email_stats;
CREATE POLICY "Public cannot access email stats" 
ON public.email_stats 
FOR ALL 
TO anon 
USING (false);

-- 4. Add explicit policy to prevent public access to user_activity_logs
DROP POLICY IF EXISTS "Public cannot access activity logs" ON public.user_activity_logs;
CREATE POLICY "Public cannot access activity logs" 
ON public.user_activity_logs 
FOR ALL 
TO anon 
USING (false);

-- 5. Add explicit policy to prevent public access to admin_activity_logs
DROP POLICY IF EXISTS "Public cannot access admin logs" ON public.admin_activity_logs;
CREATE POLICY "Public cannot access admin logs" 
ON public.admin_activity_logs 
FOR ALL 
TO anon 
USING (false);

-- 6. Strengthen profiles table - prevent anon access to sensitive user data
DROP POLICY IF EXISTS "Public cannot access profiles" ON public.profiles;
CREATE POLICY "Public cannot access profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);

-- 7. Add function to validate admin access with additional security checks
CREATE OR REPLACE FUNCTION public.check_admin_role_strict()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is authenticated first
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user exists in profiles with admin role
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'admin'
      AND email IS NOT NULL  -- Additional check to ensure profile is complete
  );
END;
$$;

-- 8. Update all admin policies to use the strict check
-- Appointments
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments" 
ON public.appointments 
FOR ALL 
USING (check_admin_role_strict());

-- Subscribers  
DROP POLICY IF EXISTS "Admins can manage all subscribers" ON public.subscribers;
CREATE POLICY "Admins can manage all subscribers" 
ON public.subscribers 
FOR ALL 
USING (check_admin_role_strict());

-- Email stats
DROP POLICY IF EXISTS "Admin can view email stats" ON public.email_stats;
CREATE POLICY "Admin can view email stats" 
ON public.email_stats 
FOR SELECT 
USING (check_admin_role_strict());

-- User activity logs
DROP POLICY IF EXISTS "Admins can view user activity logs" ON public.user_activity_logs;
CREATE POLICY "Admins can view user activity logs" 
ON public.user_activity_logs 
FOR SELECT 
USING (check_admin_role_strict());

-- Admin activity logs
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can view all activity logs" 
ON public.admin_activity_logs 
FOR SELECT 
USING (check_admin_role_strict());

DROP POLICY IF EXISTS "Admins can create activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can create activity logs" 
ON public.admin_activity_logs 
FOR INSERT 
WITH CHECK ((auth.uid() = admin_id) AND check_admin_role_strict());

-- 9. Add data masking function for sensitive fields (optional but recommended)
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_type text, original_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CASE data_type
    WHEN 'email' THEN
      -- Mask email: user@domain.com -> u***@d*****.com
      RETURN CASE 
        WHEN length(original_value) > 0 THEN 
          substring(original_value, 1, 1) || '***@' || 
          substring(split_part(original_value, '@', 2), 1, 1) || 
          repeat('*', greatest(0, length(split_part(original_value, '@', 2)) - 5)) ||
          right(split_part(original_value, '@', 2), 4)
        ELSE '***'
      END;
    WHEN 'phone' THEN
      -- Mask phone: +1234567890 -> +123***7890
      RETURN CASE 
        WHEN length(original_value) >= 8 THEN 
          left(original_value, 4) || '***' || right(original_value, 4)
        ELSE '***'
      END;
    ELSE 
      '***'
  END;
END;
$$;