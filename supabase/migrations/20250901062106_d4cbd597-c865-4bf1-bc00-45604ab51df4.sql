-- Fix security issues: Strengthen RLS policies for sensitive data (Fixed version)

-- 1. Add explicit policies to prevent public access to sensitive tables
DROP POLICY IF EXISTS "Public cannot access appointments" ON public.appointments;
CREATE POLICY "Public cannot access appointments" 
ON public.appointments 
FOR ALL 
TO anon 
USING (false);

DROP POLICY IF EXISTS "Public cannot access subscribers" ON public.subscribers;
CREATE POLICY "Public cannot access subscribers" 
ON public.subscribers 
FOR ALL 
TO anon 
USING (false);

DROP POLICY IF EXISTS "Public cannot access email stats" ON public.email_stats;
CREATE POLICY "Public cannot access email stats" 
ON public.email_stats 
FOR ALL 
TO anon 
USING (false);

DROP POLICY IF EXISTS "Public cannot access activity logs" ON public.user_activity_logs;
CREATE POLICY "Public cannot access activity logs" 
ON public.user_activity_logs 
FOR ALL 
TO anon 
USING (false);

DROP POLICY IF EXISTS "Public cannot access admin logs" ON public.admin_activity_logs;
CREATE POLICY "Public cannot access admin logs" 
ON public.admin_activity_logs 
FOR ALL 
TO anon 
USING (false);

DROP POLICY IF EXISTS "Public cannot access profiles" ON public.profiles;
CREATE POLICY "Public cannot access profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);

-- 2. Create stricter admin role checking function
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
      AND email IS NOT NULL
  );
END;
$$;