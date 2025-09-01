-- Update admin policies to use stricter security checks

-- Update appointments policies
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments" 
ON public.appointments 
FOR ALL 
USING (check_admin_role_strict());

-- Update subscribers policies  
DROP POLICY IF EXISTS "Admins can manage all subscribers" ON public.subscribers;
CREATE POLICY "Admins can manage all subscribers" 
ON public.subscribers 
FOR ALL 
USING (check_admin_role_strict());

DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.subscribers;
CREATE POLICY "Admins can view all subscribers" 
ON public.subscribers 
FOR SELECT 
USING (check_admin_role_strict());

-- Update email stats policies
DROP POLICY IF EXISTS "Admin can view email stats" ON public.email_stats;
CREATE POLICY "Admin can view email stats" 
ON public.email_stats 
FOR SELECT 
USING (check_admin_role_strict());

-- Update activity logs policies
DROP POLICY IF EXISTS "Admins can view user activity logs" ON public.user_activity_logs;
CREATE POLICY "Admins can view user activity logs" 
ON public.user_activity_logs 
FOR SELECT 
USING (check_admin_role_strict());

-- Update admin activity logs policies
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

-- Update profiles policies to use stricter checks
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (check_admin_role_strict());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (check_admin_role_strict())
WITH CHECK (check_admin_role_strict());