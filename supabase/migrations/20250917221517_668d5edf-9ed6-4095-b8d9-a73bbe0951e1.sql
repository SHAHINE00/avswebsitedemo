-- Comprehensive RLS Policy Security Fixes
-- Drop existing conflicting policies and create secure, explicit policies

-- ========================================
-- APPOINTMENTS TABLE SECURITY FIXES
-- ========================================

-- Drop all existing policies on appointments to start fresh
DROP POLICY IF EXISTS "appointments_admins_all" ON public.appointments;
DROP POLICY IF EXISTS "appointments_anon_no_access" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_users_update_own" ON public.appointments;

-- Create new secure policies for appointments
-- 1. Explicit DENY for anonymous users
CREATE POLICY "appointments_deny_anonymous" 
ON public.appointments 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 2. Admins can do everything
CREATE POLICY "appointments_admin_full_access" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- 3. Authenticated users can only see their own appointments
CREATE POLICY "appointments_user_own_select" 
ON public.appointments 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. Authenticated users can only create appointments for themselves
CREATE POLICY "appointments_user_own_insert" 
ON public.appointments 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 5. Authenticated users can only update their own appointments
CREATE POLICY "appointments_user_own_update" 
ON public.appointments 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ========================================
-- PENDING_USERS TABLE SECURITY FIXES
-- ========================================

-- Drop existing policies on pending_users
DROP POLICY IF EXISTS "Admins can manage all pending users" ON public.pending_users;
DROP POLICY IF EXISTS "pending_users_authenticated_admin_only" ON public.pending_users;
DROP POLICY IF EXISTS "pending_users_restrict_anon" ON public.pending_users;

-- Create new secure policies for pending_users (admin-only table)
-- 1. Explicit DENY for anonymous users
CREATE POLICY "pending_users_deny_anonymous" 
ON public.pending_users 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 2. Explicit DENY for regular authenticated users
CREATE POLICY "pending_users_deny_regular_users" 
ON public.pending_users 
FOR ALL 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- ========================================
-- SUBSCRIBERS TABLE SECURITY FIXES
-- ========================================

-- Drop existing policies on subscribers
DROP POLICY IF EXISTS "Admins can manage all subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Public cannot access subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_authenticated_admin_only" ON public.subscribers;
DROP POLICY IF EXISTS "subscribers_restrict_anon" ON public.subscribers;

-- Create new secure policies for subscribers (admin-only table)
-- 1. Explicit DENY for anonymous users
CREATE POLICY "subscribers_deny_anonymous" 
ON public.subscribers 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 2. Only admins can access subscribers
CREATE POLICY "subscribers_admin_only" 
ON public.subscribers 
FOR ALL 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- ========================================
-- PROFILES TABLE SECURITY FIXES
-- ========================================

-- Drop existing policies on profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public cannot access profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new secure policies for profiles
-- 1. Explicit DENY for anonymous users
CREATE POLICY "profiles_deny_anonymous" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 2. Users can view their own profile
CREATE POLICY "profiles_user_own_select" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "profiles_user_own_update" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. Admins can view all profiles
CREATE POLICY "profiles_admin_select_all" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (check_admin_role_strict());

-- 5. Admins can update all profiles
CREATE POLICY "profiles_admin_update_all" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- 6. Admins can insert profiles (for user creation)
CREATE POLICY "profiles_admin_insert" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (check_admin_role_strict());

-- ========================================
-- ADDITIONAL SECURITY HARDENING
-- ========================================

-- Ensure all sensitive tables have explicit anonymous denial
-- USER_ACTIVITY_LOGS
DROP POLICY IF EXISTS "Admins can view user activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Public cannot access activity logs" ON public.user_activity_logs;

CREATE POLICY "user_activity_logs_deny_anonymous" 
ON public.user_activity_logs 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

CREATE POLICY "user_activity_logs_admin_only" 
ON public.user_activity_logs 
FOR ALL 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- ADMIN_ACTIVITY_LOGS
DROP POLICY IF EXISTS "Admins can create activity logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Public cannot access admin logs" ON public.admin_activity_logs;

CREATE POLICY "admin_activity_logs_deny_anonymous" 
ON public.admin_activity_logs 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

CREATE POLICY "admin_activity_logs_admin_select" 
ON public.admin_activity_logs 
FOR SELECT 
TO authenticated 
USING (check_admin_role_strict());

CREATE POLICY "admin_activity_logs_admin_insert" 
ON public.admin_activity_logs 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = admin_id AND check_admin_role_strict());

-- EMAIL_STATS
DROP POLICY IF EXISTS "Admin can view email stats" ON public.email_stats;
DROP POLICY IF EXISTS "Public cannot access email stats" ON public.email_stats;

CREATE POLICY "email_stats_deny_anonymous" 
ON public.email_stats 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

CREATE POLICY "email_stats_admin_only" 
ON public.email_stats 
FOR ALL 
TO authenticated 
USING (check_admin_role_strict()) 
WITH CHECK (check_admin_role_strict());

-- UNSUBSCRIBES
DROP POLICY IF EXISTS "Public cannot access unsubscribes" ON public.unsubscribes;

CREATE POLICY "unsubscribes_deny_all" 
ON public.unsubscribes 
FOR ALL 
TO anon, authenticated 
USING (false) 
WITH CHECK (false);

-- UNSUBSCRIBE_TOKENS
DROP POLICY IF EXISTS "Public cannot access unsubscribe tokens" ON public.unsubscribe_tokens;

CREATE POLICY "unsubscribe_tokens_deny_all" 
ON public.unsubscribe_tokens 
FOR ALL 
TO anon, authenticated 
USING (false) 
WITH CHECK (false);

-- ========================================
-- SECURITY VALIDATION FUNCTION
-- ========================================

-- Create a function to validate RLS policy effectiveness
CREATE OR REPLACE FUNCTION public.validate_rls_security()
RETURNS TABLE(table_name text, security_level text, issues text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.table_name 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'SECURE'
      ELSE 'NEEDS_REVIEW'
    END as security_level,
    ARRAY[
      CASE WHEN NOT t.row_security THEN 'RLS_DISABLED' END,
      CASE WHEN NOT EXISTS (
        SELECT 1 FROM pg_policies p 
        WHERE p.schemaname = 'public' 
        AND p.tablename = t.table_name 
        AND p.roles = '{anon}' 
        AND p.qual = 'false'
      ) THEN 'NO_ANON_DENIAL' END
    ]::text[] as issues
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  AND t.tablename IN (
    'appointments', 'pending_users', 'subscribers', 'profiles',
    'user_activity_logs', 'admin_activity_logs', 'email_stats',
    'unsubscribes', 'unsubscribe_tokens'
  );
END;
$$;