-- Phase 1: Fix Remaining RLS Policies to use new role system

-- First, drop all policies that depend on check_admin_role functions
DROP POLICY IF EXISTS "user_activity_logs_admin_only" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.user_activity_logs;

-- Now we can safely drop the old functions
DROP FUNCTION IF EXISTS public.check_admin_role();
DROP FUNCTION IF EXISTS public.check_admin_role_strict();

-- Recreate user_preferences policies with new role system
CREATE POLICY "Users can manage their own notification preferences"
ON public.user_preferences
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all notification preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Recreate user_activity_logs policies with new role system
CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
ON public.user_activity_logs
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert activity logs"
ON public.user_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);